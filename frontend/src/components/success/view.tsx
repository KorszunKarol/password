"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface SuccessViewProps {
  url: string
  onDownload: () => void
}

export const SuccessView = ({ url, onDownload }: SuccessViewProps) => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 w-[464px] bg-white shadow-lg rounded-2xl">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          File Protected Successfully
        </h3>
        <p className="text-sm text-gray-600">
          Your file is now password protected and ready to download
        </p>
      </div>

      <Button
        variant="outline"
        className="text-blue-600 hover:text-blue-700"
        onClick={onDownload}
      >
        <Download className="mr-2 h-4 w-4" />
        Download Protected File
      </Button>
    </div>
  )
}