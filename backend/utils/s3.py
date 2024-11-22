import boto3
import os
from botocore.exceptions import ClientError
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class S3Client:
    """AWS S3 client following best practices"""

    def __init__(self):
        self.region = os.getenv('AWS_REGION')
        self.bucket_name = os.getenv('AWS_BUCKET_NAME')
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=self.region
        )

    async def upload_file(self, file_data: bytes, file_key: str) -> str:
        """Upload file to S3 and return presigned URL"""
        try:
            # Upload file
            self.s3.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=file_data
            )

            # Generate URL that expires in 5 minutes
            url = self.s3.generate_presigned_url(
                ClientMethod='get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': file_key,
                },
                ExpiresIn=300  # 5 minutes
            )

            logger.info(f"File uploaded: {file_key}")
            return url
        except ClientError as e:
            logger.error(f"S3 upload error: {str(e)}")
            raise

    async def get_download_url(self, file_key: str) -> str:
        """Generate presigned URL for downloading"""
        try:
            url = self.s3.generate_presigned_url(
                ClientMethod='get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': file_key,
                },
                ExpiresIn=300  # 5 minutes
            )
            logger.info(f"Generated download URL for: {file_key}")
            return url
        except ClientError as e:
            logger.error(f"Failed to generate download URL: {str(e)}")
            raise

    async def delete_file(self, file_key: str):
        """Delete file from S3"""
        try:
            logger.info(f"Attempting to delete file: {file_key}")
            response = self.s3.delete_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
            # Check if deletion was successful
            if response.get('DeleteMarker', False):
                logger.info(f"File deleted successfully: {file_key}")
            else:
                logger.info(f"File deletion response: {response}")

        except ClientError as e:
            logger.error(f"S3 delete error for {file_key}: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error deleting {file_key}: {str(e)}")
            raise

    async def list_objects(self, prefix: str) -> list[str]:
        """List objects with specified prefix"""
        try:
            response = self.s3.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            return [obj['Key'] for obj in response.get('Contents', [])]
        except ClientError as e:
            logger.error(f"S3 list objects error: {str(e)}")
            raise

    async def get_object_metadata(self, file_key: str):
        """Get object metadata"""
        try:
            response = self.s3.head_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
            return response
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return None
            raise