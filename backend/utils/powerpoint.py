import io
import logging
from cryptography.fernet import Fernet
from base64 import b64encode
from .s3 import S3Client

logger = logging.getLogger(__name__)

class PowerPointProcessor:
    def __init__(self):
        self.s3_client = S3Client()

    async def add_password(self, file_content: bytes, file_id: str, password: str) -> str:
        """
        Add encryption-based protection to a PowerPoint file content
        Returns: S3 presigned URL for the encrypted file
        """
        try:
            # Generate a key from the password
            key = b64encode(password.encode()[:32].ljust(32, b'\0'))
            fernet = Fernet(key)

            # Encrypt the file content
            encrypted_data = fernet.encrypt(file_content)

            # Upload to S3
            file_key = f"encrypted/{file_id}.pptz"
            url = await self.s3_client.upload_file(encrypted_data, file_key)

            return url

        except Exception as e:
            logger.error(f"Failed to process file: {str(e)}")
            raise

    def cleanup(self):
        """Clean up temporary files"""
        try:
            shutil.rmtree(self.temp_dir)
            logger.info("Cleaned up temporary directory")
        except Exception as e:
            logger.error(f"Failed to cleanup: {str(e)}")