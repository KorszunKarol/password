"use client"

import * as React from "react"
import { useState } from "react"
import { FileDropzone } from "@/components/file-selection/dropzone"
import { PasswordForm, LoadingView } from "@/components/password-form"
import { SuccessView } from "@/components/success/view"
import * as api from "@/lib/api"

export const UploadFlow: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
  }

  const handlePasswordSubmit = async (password: string) => {
    if (!file) return

    setIsLoading(true)
    try {
      const response = await api.uploadFile(file, password)
      setDownloadUrl(api.getDownloadUrl(response.id))
    } catch (error) {
      console.error('Upload failed:', error)
      setIsLoading(false)
    }
  }

  if (downloadUrl) {
    return <SuccessView url={downloadUrl} onDownload={() => window.open(downloadUrl, '_blank')} />
  }

  if (isLoading) {
    return (
      <LoadingView
        fileName={file?.name || ""}
        fileSize={file?.size || 0}
      />
    )
  }

  if (file) {
    return (
      <PasswordForm
        file={file}
        onCancel={() => setFile(null)}
        onSubmit={handlePasswordSubmit}
      />
    )
  }

  return (
    <FileDropzone
      onFileSelect={handleFileSelect}
      accept={{
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
        "application/vnd.ms-powerpoint": [".ppt"],
      }}
    />
  )
}