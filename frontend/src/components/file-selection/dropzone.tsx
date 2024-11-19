"use client"

import { useCallback } from "react"
import { useDropzone, DropzoneOptions } from "react-dropzone"
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

  const dropzoneOptions: DropzoneOptions = {
    onDrop: handleDrop,
    accept,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {}
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions)

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
          <div className="relative flex items-center justify-center w-16 h-16 bg-[#EAECF0] border-8 border-[#F2F4F7] rounded-full">
            <Image
              src="/upload-cloud-01.svg"
              alt="Upload cloud icon"
              width={32}
              height={32}
              priority
              className="w-8 h-8"
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