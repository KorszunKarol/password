"use client"

import * as React from "react"
import { useState } from "react"
import { FileDropzone } from "@/components/file-selection"
import { PasswordForm, LoadingView } from "@/components/password-form"
import { SuccessView } from "@/components/success"
import * as api from "@/lib/api"

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
      const response = await api.uploadFile(file, password)
      const url = await api.getDownloadUrl(response.id)
      setDownloadUrl(url)
    } catch (err: any) {
      console.log("Error in UploadFlow:", err)
      if (err.response?.status === 400) {
        setError("This file is already password protected. Please try another file.")
      } else {
        setError(err.message || "An error occurred during upload")
      }
      setIsLoading(false)
      return
    }
    setIsLoading(false)
  }

  const handlePasswordFocus = () => {
    setError("")
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    }
  }

  if (downloadUrl) {
    return <SuccessView url={downloadUrl} onDownload={handleDownload} />
  }

  if (isLoading) {
    return <LoadingView fileName={file?.name || ""} fileSize={file?.size || 0} />
  }

  if (file) {
    return (
      <PasswordForm
        file={file}
        onCancel={() => setFile(null)}
        onSubmit={handlePasswordSubmit}
        isSubmitting={isLoading}
        error={error}
        onPasswordFocus={handlePasswordFocus}
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