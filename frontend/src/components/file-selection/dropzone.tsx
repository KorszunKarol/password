"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface FileDropzoneProps {
  onFileSelect: (file: File) => void
  accept?: Record<string, string[]>
}

export const FileDropzone = ({ onFileSelect, accept }: FileDropzoneProps) => {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const handleFileInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.ppt,.pptx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) onFileSelect(file)
    }
    input.click()
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  })

  return (
    <div className="w-[416px]">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center p-16 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer",
          isDragActive && "border-blue-500 bg-blue-50"
        )}
      >
        <input {...getInputProps()} className="hidden" />
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-16 h-16 bg-gray-100 border-8 border-gray-50 rounded-full">
            <Image
              src="/upload-cloud-01.svg"
              alt="Upload cloud icon"
              width={32}
              height={32}
              priority
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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
      </div>
    </div>
  )
}