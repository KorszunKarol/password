export const uploadConfig = {
  validation: {
    maxFileSize: 200 * 1024 * 1024, // 200MB
    allowedFileTypes: [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint'
    ] as const,
    allowedFileExtensions: ['.pptx', '.ppt'] as const
  },
  messages: {
    invalidFileType: 'Please upload a PowerPoint file (.ppt or .pptx)',
    fileTooLarge: 'File size must be less than 200MB',
    uploadError: 'Error uploading file. Please try again.',
    processingError: 'Error processing file. Please try again.'
  }
} as const

export type AllowedFileType = typeof uploadConfig.validation.allowedFileTypes[number]
export type AllowedFileExtension = typeof uploadConfig.validation.allowedFileExtensions[number]