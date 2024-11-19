from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
import uuid
import logging
from utils.powerpoint import PowerPointProcessor
from utils.s3 import S3Client

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()
s3_client = S3Client()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    logger.info(f"Received upload request for file: {file.filename}")

    try:
        content = await file.read()
        file_id = str(uuid.uuid4())

        try:
            processor = PowerPointProcessor()
            download_url = await processor.add_password(
                content,
                file_id,
                file.filename,
                password
            )

            return JSONResponse({
                "id": file_id,
                "url": download_url,
                "filename": file.filename,
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
async def download_file(file_id: str, filename: str):
    try:
        file_key = f"protected/{file_id}_{filename}"
        download_url = await s3_client.get_download_url(file_key)

        logger.info(f"Generated download URL for file: {file_key}")
        return JSONResponse({
            "url": download_url
        })

    except Exception as e:
        logger.error(f"Download failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate download URL"
        )