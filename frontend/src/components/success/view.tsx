"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface SuccessViewProps {
  url: string
  onDownload: () => void
}

const PowerPointIcon = () => (
  <div className="relative w-[72px] h-[72px]">
    <Image
      src="/ms_powerpoint.svg"
      alt="PowerPoint icon"
      width={72}
      height={72}
      priority
    />
    <div className="absolute w-6 h-6 left-[calc(50%-12px)] top-[59px]">
      <Image
        src="/Featured icon.svg"
        alt="Success check"
        width={24}
        height={24}
        priority
      />
    </div>
  </div>
)

const ActionButton = ({
  children,
  variant = "default",
  onClick
}: {
  children: React.ReactNode
  variant?: "default" | "primary"
  onClick?: () => void
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-row justify-center items-center px-4 py-2.5 gap-2",
      "w-[202px] h-10 rounded-xl shadow-xs",
      "font-figtree font-semibold text-sm leading-5",
      variant === "default" && "bg-white text-[#344054] border border-[#D0D5DD]",
      variant === "primary" && "bg-[#1570EF] text-white border border-[#1570EF]"
    )}
  >
    {children}
  </button>
)

export const SuccessView = ({ onDownload }: SuccessViewProps) => {
  return (
    <div className="flex flex-col items-start p-6 gap-4 w-[464px] bg-white shadow-md rounded-2xl">
      <div className="flex flex-col items-start p-4 gap-4 w-[416px] h-[158px] bg-white border border-[#D0D5DD] rounded-xl">
        <div className="flex flex-col items-center p-0 gap-6 w-[384px] h-[126px]">
          <PowerPointIcon />
          <h3 className="w-[384px] h-[30px] font-figtree font-semibold text-xl leading-[30px] text-center text-[#101828]">
            Password successfully added!
          </h3>
        </div>
      </div>

      <div className="flex flex-row items-start p-0 gap-3 w-[416px] h-10">
        <ActionButton onClick={() => window.location.reload()}>
          Start over
        </ActionButton>
        <ActionButton variant="primary" onClick={onDownload}>
          Download file
        </ActionButton>
      </div>
    </div>
  )
}