"use client"

import { useCallback, useState } from "react"
import { useDropzone, DropzoneOptions } from "react-dropzone"
import Image from "next/image"
import { cn } from "@/lib/utils"
import ErrorDisplay from "@/components/ui/error-display"

interface FileDropzoneProps {
  onFileSelect: (file: File) => void
  accept: Record<string, string[]>
}

const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB

export const FileDropzone = ({ onFileSelect, accept }: FileDropzoneProps) => {
  const [error, setError] = useState<string>("")

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds the maximum limit of 200MB')
      return false
    }

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint'
    ]
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PowerPoint file (.ppt or .pptx)')
      return false
    }

    setError("")
    return true
  }

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const handleFileInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.ppt,.pptx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file && validateFile(file)) {
        onFileSelect(file)
      }
    }
    input.click()
  }

  const dropzoneOptions: DropzoneOptions = {
    onDrop: handleDrop,
    accept,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => setError(""),
    onDragOver: () => {},
    onDragLeave: () => {}
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions)

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-[416px] flex flex-col items-center p-16 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200",
        isDragActive ? "border-blue-500 bg-blue-50" : error ? "border-destructive" : "border-gray-300"
      )}
    >
      <input {...getInputProps()} className="hidden" />
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center w-[64px] h-[64px] bg-[#EAECF0] border-8 border-[#F2F4F7] rounded-[88px]">
          <Image
            src="/upload-cloud-01.svg"
            alt="Upload cloud icon"
            width={26.67}
            height={24}
            priority
            className="w-[26.67px] h-[24px]"
          />
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Drag and drop a PowerPoint file to add a password.
          </p>

          <button
            className="px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100"
            onClick={handleFileInputClick}
          >
            Choose file
          </button>
        </div>
      </div>
      {error && (
        <div className="mt-4">
          <ErrorDisplay message={error} />
        </div>
      )}
    </div>
  )
}