from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import uuid
import os
import magic
from typing import Dict
import asyncio
from utils.powerpoint import PowerPointProcessor

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp"
MAX_FILE_SIZE = 200 * 1024 * 1024  # 200MB
ALLOWED_TYPES = [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",  # .pptx
    "application/vnd.ms-powerpoint",  # .ppt
]

# In-memory storage for processing status
processing_status: Dict[str, dict] = {}

# Add PowerPoint processor instance
ppt_processor = PowerPointProcessor()

def validate_file(file: UploadFile) -> None:
    # Check file size
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size too large. Maximum size is {MAX_FILE_SIZE/1024/1024}MB"
        )

    # Check file type
    content_type = magic.from_buffer(file.file.read(2048), mime=True)
    file.file.seek(0)  # Reset file pointer

    if content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only PowerPoint files (.ppt, .pptx) are allowed"
        )

@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    try:
        # Validate file
        validate_file(file)

        # Generate unique ID
        upload_id = str(uuid.uuid4())

        # Create temp directory if it doesn't exist
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Save file with unique name
        file_path = os.path.join(UPLOAD_DIR, f"{upload_id}_{file.filename}")
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Start processing in background
        processing_status[upload_id] = {
            "status": "processing",
            "file_path": file_path,
            "original_filename": file.filename
        }

        # Process file in background
        asyncio.create_task(process_file(upload_id, file_path, password))

        return JSONResponse({
            "id": upload_id,
            "message": "File uploaded successfully"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_file(upload_id: str, file_path: str, password: str):
    try:
        # Process the file
        protected_file_path = ppt_processor.add_password(file_path, password)

        # Update status with protected file path
        processing_status[upload_id].update({
            "status": "completed",
            "protected_file_path": protected_file_path
        })

    except Exception as e:
        processing_status[upload_id].update({
            "status": "failed",
            "error": str(e)
        })

    finally:
        # Clean up original file
        if os.path.exists(file_path):
            os.remove(file_path)

@app.get("/api/status/{upload_id}")
async def get_status(upload_id: str):
    if upload_id not in processing_status:
        raise HTTPException(status_code=404, detail="Upload ID not found")

    return processing_status[upload_id]

@app.get("/api/download/{upload_id}")
async def download_file(upload_id: str):
    if upload_id not in processing_status:
        raise HTTPException(status_code=404, detail="File not found")

    file_info = processing_status[upload_id]
    if file_info["status"] != "completed":
        raise HTTPException(status_code=400, detail="File processing not completed")

    protected_file_path = file_info["protected_file_path"]
    if not os.path.exists(protected_file_path):
        raise HTTPException(status_code=404, detail="Protected file not found")

    return FileResponse(
        protected_file_path,
        filename=f"protected_{file_info['original_filename']}",
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

# Cleanup endpoint (for development)
@app.on_event("shutdown")
async def cleanup():
    """Clean up temporary files on shutdown"""
    for file_info in processing_status.values():
        try:
            if os.path.exists(file_info["file_path"]):
                os.remove(file_info["file_path"])
        except Exception:
            pass

@app.get("/api/hello")
async def read_root():
    return {"message": "Hello from FastAPI!"}