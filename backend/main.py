from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
import uuid
import io
from typing import Dict
import logging
from utils.powerpoint import PowerPointProcessor
from utils.s3 import S3Client

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp"
MAX_FILE_SIZE = 200 * 1024 * 1024  # 200MB

ALLOWED_EXTENSIONS = {'.pptx', '.ppt'}
ALLOWED_TYPES = {
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint",
}

ppt_processor = PowerPointProcessor()

@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    logger.info(f"Received upload request for file: {file.filename}")

    try:
        # Read file content into memory
        content = await file.read()
        file_id = str(uuid.uuid4())

        try:
            # Process and upload to S3
            processor = PowerPointProcessor()
            download_url = await processor.add_password(content, file_id, password)

            return JSONResponse({
                "id": file_id,
                "url": download_url,
                "message": "File uploaded and protected successfully"
            })
            
        except Exception as e:
            logger.error(f"Failed to add password protection: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Failed to add password protection to the file"
            )

    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/api/download/{file_id}")
async def download_file(file_id: str):
    try:
        # Retrieve from cache/database
        encrypted_content = await get_encrypted_file(file_id)
        if not encrypted_content:
            raise HTTPException(status_code=404, detail="File not found")

        return Response(
            content=encrypted_content,
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f"attachment; filename=protected_{file_id}.pptz"
            }
        )
    except Exception as e:
        logger.error(f"Download failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))