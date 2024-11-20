"use client"

import { useState } from "react"
import ErrorDisplay from "@/components/ui/error-display"

interface PasswordInputProps {
  disabled?: boolean
  error?: string
  onChange?: (value: string) => void
  value?: string
  onFocus?: () => void
}

export const PasswordInput = ({ disabled, error, onChange, value, onFocus }: PasswordInputProps) => {
  console.log('PasswordInput error:', error)
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="password" className="text-sm font-medium text-gray-700">
        Password
      </label>
      <div className="relative">
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="new-password"
          required
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={onFocus}
          className={`w-full rounded-xl border transition-colors duration-200 ${
            error ? 'border-destructive ring-1 ring-destructive' : 'border-gray-300'
          } px-4 py-2 focus:border-blue-500 focus:outline-none`}
        />
      </div>
      <ErrorDisplay message={error || ""} />
    </div>
  )
}