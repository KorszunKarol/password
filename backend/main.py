from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid
import logging
from utils.powerpoint import PowerPointProcessor
from utils.s3 import S3Client
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import asyncio
from datetime import datetime, timezone
import os
from typing import List

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    cleanup = asyncio.create_task(cleanup_task(60))
    yield
    cleanup.cancel()
    try:
        await cleanup
    except asyncio.CancelledError:
        pass

app = FastAPI(lifespan=lifespan)
s3_client = S3Client()
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

def get_allowed_origins() -> List[str]:
    env = os.getenv("ENV", "development")
    if env == "production":
        return [os.getenv("FRONTEND_URL", "http://frontend:3000")]
    return ["http://localhost:3000", "http://127.0.0.1:3000", "http://frontend:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    expose_headers=["Content-Disposition"],
    max_age=600
)

async def cleanup_task(time: int):
    while True:
        try:
            objects = await s3_client.list_objects("protected/")
            for file_key in objects:
                try:
                    metadata = await s3_client.get_object_metadata(file_key)
                    if metadata and metadata.get('LastModified'):
                        age = (datetime.now(timezone.utc) - metadata['LastModified']).total_seconds()
                        if age > time:
                            await s3_client.delete_file(file_key)
                            logger.info(f"Cleaned up expired file: {file_key}")
                except Exception as e:
                    logger.error(f"Error cleaning up file {file_key}: {str(e)}")
        except Exception as e:
            logger.error(f"Error in cleanup task: {str(e)}")
        await asyncio.sleep(time)

async def handle_file_cleanup(file_key: str, delay: int = 60):
    logger.info(f"Starting cleanup task for {file_key}")
    try:
        await asyncio.sleep(delay)
        logger.info(f"Cleanup delay completed, deleting file: {file_key}")
        await s3_client.delete_file(file_key)
        logger.info(f"File deleted successfully: {file_key}")
    except Exception as e:
        logger.error(f"Cleanup failed for {file_key}: {str(e)}")
        raise

async def get_file_key(file_id: str) -> str:
    objects = await s3_client.list_objects(f"protected/{file_id}")
    if not objects:
        raise HTTPException(status_code=404, detail="File not found")
    return objects[0]

@app.post("/api/upload")
@limiter.limit("10/minute")
async def upload_file(request: Request, file: UploadFile = File(...), password: str = Form(...)):
    try:
        content = await file.read()
        file_id = str(uuid.uuid4())
        processor = PowerPointProcessor()
        download_url = await processor.add_password(content, file_id, file.filename, password)
        return JSONResponse({
            "id": file_id,
            "url": download_url,
            "filename": file.filename,
            "message": "File uploaded and protected successfully"
        })
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@app.get("/api/download/{file_id}")
async def download_file(file_id: str):
    try:
        file_key = await get_file_key(file_id)
        download_url = await s3_client.get_download_url(file_key)
        cleanup_task = asyncio.create_task(handle_file_cleanup(file_key, delay=60))
        def cleanup_callback(task):
            try:
                task.result()
                logger.info(f"Cleanup task completed successfully for {file_key}")
            except Exception as e:
                logger.error(f"Cleanup task failed for {file_key}: {str(e)}")
        cleanup_task.add_done_callback(cleanup_callback)
        return JSONResponse({"url": download_url})
    except Exception as e:
        logger.error(f"Download failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate download URL")

@app.delete("/api/files/{file_id}")
async def delete_file(file_id: str):
    try:
        file_key = await get_file_key(file_id)
        await s3_client.delete_file(file_key)
        return JSONResponse({
            "message": "File deleted successfully",
            "file_id": file_id
        })
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete file")

