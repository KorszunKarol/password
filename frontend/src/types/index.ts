export interface FileUploadResponse {
  id: string
  url: string
  filename: string
  message: string
}

export interface ApiError {
  detail: string
  status: number
}