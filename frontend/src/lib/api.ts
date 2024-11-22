import { AllowedFileType, uploadConfig } from '@/config/upload.config'
import { apiConfig } from '@/config/api.config'
import type { FileUploadResponse } from '@/types'
import { ApiError } from '@/lib/errors'

const validateFile = (file: File): void => {
  if (file.size > uploadConfig.validation.maxFileSize) {
    throw new ApiError(uploadConfig.messages.fileTooLarge, 400)
  }

  if (!uploadConfig.validation.allowedFileTypes.includes(file.type as AllowedFileType)) {
    throw new ApiError(uploadConfig.messages.invalidFileType, 400)
  }
}

export const uploadFile = async (
  file: File,
  password: string
): Promise<FileUploadResponse> => {
  validateFile(file)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('password', password)

  try {
    const response = await fetch(apiConfig.endpoints.upload, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new ApiError(error.detail || uploadConfig.messages.uploadError, response.status)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error. Please check your connection.', 0)
  }
}

export const handleApiError = (error: Error | unknown): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new ApiError(error.message, 500);
  }

  throw new ApiError('An unexpected error occurred', 500);
};