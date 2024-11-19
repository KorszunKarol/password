"use client"

import { FileCardHeader } from "@/components/shared/file-card-header"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LoadingViewProps {
  fileName: string
  fileSize: number
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center w-8 h-8 relative flex-shrink-0">
    <Image
      src="/Loading circle.svg"
      alt="Loading"
      width={32}
      height={32}
      className="animate-[loadingCircle_2s_linear_infinite]"
      priority
    />
  </div>
)

const LoadingMessage = () => (
  <div className="flex flex-row items-start p-4 w-[416px] h-16 bg-white border border-[#D0D5DD] rounded-xl">
    <div className="flex flex-row items-center gap-2 w-[384px] h-8 flex-grow">
      <LoadingSpinner />
      <p className="font-figtree text-sm font-medium leading-5 text-[#344054]">
        Adding password to your presentation
      </p>
    </div>
  </div>
)

const ActionButtons = () => (
  <div className="flex gap-3 w-[416px]">
    <button
      type="button"
      disabled
      className={cn(
        "flex-1 px-4 py-2.5 text-sm font-semibold",
        "text-gray-300 bg-white border border-gray-200",
        "rounded-xl shadow-sm"
      )}
    >
      Cancel
    </button>
    <button
      type="button"
      disabled
      className={cn(
        "flex-1 px-4 py-2.5 text-sm font-semibold",
        "text-white bg-blue-200 border border-blue-200",
        "rounded-xl shadow-sm flex items-center justify-center"
      )}
    >
      <Image
        src="/loading_icon.svg"
        alt="Loading"
        width={20}
        height={20}
        className="animate-[loadingButton_2s_linear_infinite]"
        priority
      />
    </button>
  </div>
)

export const LoadingView = ({ fileName, fileSize }: LoadingViewProps) => {
  return (
    <div className="flex flex-col p-6 gap-4 w-[464px] bg-white shadow-lg rounded-2xl">
      <FileCardHeader name={fileName} size={fileSize} />
      <LoadingMessage />
      <ActionButtons />
    </div>
  )
}