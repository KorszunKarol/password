"use client"

import Image from "next/image"
import { cn } from "../../lib/utils"

interface PasswordInputProps {
  disabled?: boolean
}

export const PasswordInput = ({ disabled }: PasswordInputProps) => {
  return (
    <div className={cn(
      "flex items-center w-[416px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm",
      disabled && "opacity-50"
    )}>
      <div className="flex items-center gap-2 w-full">
        <Image
          src="/loading_icon.svg"
          alt="Lock icon"
          width={20}
          height={20}
          className="flex-shrink-0"
          style={{ width: 20, height: 20 }}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          autoComplete="new-password"
          disabled={disabled}
          required
          className="w-full text-gray-600 bg-transparent border-none outline-none placeholder-gray-500 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}