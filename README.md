# PowerPoint Password Protection Tool

A secure web application for adding password protection to PowerPoint presentations.

## Features
- Secure file upload with type validation
- Password protection for PowerPoint files
- Automatic file cleanup
- Rate limiting
- Presigned URLs for secure downloads

## Architecture
- Frontend: Next.js + TypeScript + TailwindCSS
- Backend: FastAPI + Python
- Storage: AWS S3
- Security: Rate limiting, file validation, automatic cleanup

## Local Development
1. Clone the repository
2. Set up environment variables
3. Install dependencies
4. Run development servers

## API Documentation
- POST /api/upload
- GET /api/download/{file_id}
- DELETE /api/files/{file_id}

## Security Features
- File type validation
- Rate limiting
- Automatic file cleanup
- Secure URL generation

## Screenshots
[Add screenshots/GIFs here]
