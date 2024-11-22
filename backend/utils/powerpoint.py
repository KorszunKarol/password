import io
import logging
from msoffcrypto import OfficeFile
from .s3 import S3Client

logger = logging.getLogger(__name__)

class PowerPointProcessor:
    """Process PowerPoint files with password protection using msoffcrypto"""

    def __init__(self):
        self.s3_client = S3Client()

    async def add_password(self, file_content: bytes, file_id: str, original_filename: str, password: str) -> str:
        """Add password protection to PowerPoint file using msoffcrypto. Returns S3 presigned URL for the protected file"""
        try:
            input_buffer = io.BytesIO(file_content)
            output_buffer = io.BytesIO()
            office_file = OfficeFile(input_buffer)

            try:
                office_file.encrypt(password, output_buffer)
            except Exception as e:
                if "already encrypted" in str(e).lower() or "file is encrypted" in str(e).lower():
                    logger.error("File is already encrypted")
                    raise ValueError("This file is already password protected. Please use an unprotected file.")
                raise e

            protected_content = output_buffer.getvalue()
            file_key = f"protected/{file_id}/{original_filename}"
            url = await self.s3_client.upload_file(protected_content, file_key)

            input_buffer.close()
            output_buffer.close()

            return url

        except ValueError as e:
            logger.error(f"Validation error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error in add_password: {str(e)}")
            raise ValueError("Unable to add password protection to this file. Please ensure it's not already protected.")