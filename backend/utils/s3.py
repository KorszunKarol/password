import boto3
import os
from botocore.exceptions import ClientError
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class S3Client:
    def __init__(self):
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        self.bucket_name = os.getenv('AWS_BUCKET_NAME')

    async def upload_file(self, file_data: bytes, file_key: str) -> str:
        """Upload file to S3 and return its URL"""
        try:
            self.s3.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=file_data
            )

            # Generate presigned URL for download (valid for 1 hour)
            url = self.s3.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': file_key
                },
                ExpiresIn=3600
            )

            return url

        except ClientError as e:
            logger.error(f"S3 upload error: {str(e)}")
            raise

    async def delete_file(self, file_key: str):
        """Delete file from S3"""
        try:
            self.s3.delete_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
        except ClientError as e:
            logger.error(f"S3 delete error: {str(e)}")
            raise