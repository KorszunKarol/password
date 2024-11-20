from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response, RedirectResponse
import uuid
import logging
from utils.powerpoint import PowerPointProcessor
from utils.s3 import S3Client
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()
s3_client = S3Client()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("https_redirect")
async def https_redirect(request, call_next):
    if request.url.scheme == "http":
        url = request.url.replace(scheme="https")
        return RedirectResponse(url=str(url))
    return await call_next(request)

@app.post("/api/upload")
@limiter.limit("10/minute")
async def upload_file(file: UploadFile = File(...), password: str = Form(...)):
    """Handle file upload and password protection"""
    try:
        content = await file.read()
        file_id = str(uuid.uuid4())

        try:
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

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@app.get("/api/download/{file_id}")
async def download_file(file_id: str):
    """Generate download URL for protected file"""
    try:
        objects = await s3_client.list_objects(f"protected/{file_id}")
        if not objects:
            raise HTTPException(status_code=404, detail="File not found")

        file_key = objects[0]
        original_filename = file_key.split('/')[-1]

        download_url = await s3_client.get_download_url(
            file_key=file_key,
            response_filename=f"protected_{original_filename}"
        )

        logger.info(f"Generated download URL for file: {file_key}")
        return JSONResponse({"url": download_url})

    except Exception as e:
        logger.error(f"Download failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate download URL")