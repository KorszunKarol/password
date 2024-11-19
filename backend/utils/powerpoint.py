import os
from pptx import Presentation
import tempfile
import shutil
from cryptography.fernet import Fernet
import base64
import hashlib

class PowerPointProcessor:
    def add_password(self, file_path: str, password: str) -> str:
        try:
            # Create a temporary directory for processing
            temp_dir = tempfile.mkdtemp()
            filename = os.path.basename(file_path)
            output_path = os.path.join(temp_dir, f"protected_{filename}")

            # Copy file to temp directory
            shutil.copy2(file_path, output_path)

            # Generate a key from the password
            key = base64.urlsafe_b64encode(hashlib.sha256(password.encode()).digest())
            f = Fernet(key)

            # Read the file
            with open(output_path, 'rb') as file:
                file_data = file.read()

            # Encrypt the file
            encrypted_data = f.encrypt(file_data)

            # Write the encrypted file
            with open(output_path, 'wb') as file:
                file.write(encrypted_data)

            return output_path

        except Exception as e:
            raise Exception(f"Failed to add password protection: {str(e)}")