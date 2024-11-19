"use client"

import Image from "next/image"

interface LoadingViewProps {
  fileName: string
  fileSize: string
}

export const LoadingView: React.FC<LoadingViewProps> = ({ fileName, fileSize }) => {
  return (
    <div className="flex flex-col p-6 gap-3 w-[464px] bg-white shadow-md rounded-2xl">
      {/* File Info */}
      <div className="flex flex-col p-4 w-[416px] bg-white border border-gray-300 rounded-xl">
        <p className="text-gray-900 font-medium">{fileName}</p>
        <p className="text-sm text-gray-500">{fileSize}</p>
      </div>

      {/* Loading Status */}
      <div className="flex items-center gap-3 p-4 w-[416px] bg-white border border-gray-300 rounded-xl">
        <Image
          src="/loading_icon.svg"
          alt="Loading spinner"
          width={20}
          height={20}
          className="animate-spin"
          priority
        />
        <span className="text-sm text-gray-700">
          Adding password to your presentation
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 w-[416px]">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled
          className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-200 border border-blue-200 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-center">
            <Image
              src="/loading_icon.svg"
              alt="Loading spinner"
              width={20}
              height={20}
              className="animate-spin"
              priority
            />
          </div>
        </button>
      </div>
    </div>
  )
}