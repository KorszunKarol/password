"use client"

import * as React from "react"
import { useState } from "react"
import { FileDropzone } from "@/components/file-selection"
import { PasswordForm } from "@/components/password-form"
import { LoadingView } from "@/components/loading"
import { SuccessView } from "@/components/success"

export const UploadFlow: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string>("")

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setError("")
  }

  const handlePasswordSubmit = async (password: string) => {
    if (!file) return

    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)

      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Upload failed')
      }

      const data = await response.json()
      setDownloadUrl(data.url)
    } catch (err) {
      console.error("Error in UploadFlow:", err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordFocus = () => {
    setError("")
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }

  if (isLoading && file) {
    return (
      <LoadingView
        fileName={file.name}
        fileSize={file.size}
      />
    )
  }

  if (downloadUrl) {
    return <SuccessView url={downloadUrl} onDownload={handleDownload} />
  }

  return (
    <div className="flex flex-col gap-4">
      {file ? (
        <PasswordForm
          file={file}
          onCancel={() => setFile(null)}
          onSubmit={handlePasswordSubmit}
          isSubmitting={isLoading}
          error={error}
          onPasswordFocus={handlePasswordFocus}
        />
      ) : (
        <FileDropzone
          onFileSelect={handleFileSelect}
          accept={{
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'application/vnd.ms-powerpoint': ['.ppt']
          }}
        />
      )}
    </div>
  )
}