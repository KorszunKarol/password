"use client"

import { formatSize } from "@/lib/utils/format-size"

interface FileCardHeaderProps {
    name: string
    size: number
}

export const FileCardHeader = ({ name, size }: FileCardHeaderProps) => {
    return (
        <div className="flex flex-col items-center p-4 w-[416px] h-[86px] bg-white border border-[#D0D5DD] rounded-xl shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)]">
            <div className="flex flex-col items-center justify-center gap-2 w-full">
                <h3 className="font-figtree font-semibold text-lg leading-[26px] text-[#1D2939] text-center truncate w-full">
                    {name}
                </h3>
                <p className="font-figtree font-normal text-sm leading-5 text-[#475467] text-center">
                    {formatSize(size)}
                </p>
            </div>
        </div>
    )
}