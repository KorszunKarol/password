"use client"

import * as React from "react"
import { FormEvent } from "react"
import { FileCardHeader } from "@/components/shared/file-card-header"
import ErrorDisplay from "@/components/ui/error-display"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface PasswordFormProps {
  file: File
  onCancel: () => void
  onSubmit: (password: string) => Promise<void>
  isSubmitting?: boolean
  error?: string
  onPasswordFocus?: () => void
}

const PasswordInput = ({ disabled, error, onFocus }: {
  disabled?: boolean
  error?: string
  onFocus?: () => void
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="password" className="text-sm font-medium text-gray-700">
        Password
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Image
            src="/Icon.svg"
            alt="Password icon"
            width={20}
            height={20}
            className="text-gray-500"
          />
        </div>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          autoComplete="new-password"
          required
          disabled={disabled}
          onFocus={onFocus}
          className={cn(
            "w-full rounded-xl border transition-colors duration-200 pl-11 pr-4 py-2 focus:border-blue-500 focus:outline-none",
            error ? "border-destructive ring-1 ring-destructive" : "border-gray-300"
          )}
        />
      </div>
      <ErrorDisplay message={error || ""} />
    </div>
  )
}

const ActionButtons = ({ onCancel, isLoading }: {
  onCancel: () => void
  isLoading?: boolean
}) => {
  return (
    <div className="flex gap-3 w-[416px]">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-white"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-xl shadow-sm hover:bg-blue-700 disabled:bg-blue-200 disabled:border-blue-200"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          'Lock File'
        )}
      </button>
    </div>
  )
}

export const PasswordForm = ({
  file,
  onCancel,
  onSubmit,
  isSubmitting = false,
  error,
  onPasswordFocus
}: PasswordFormProps) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value
    if (!password) return
    await onSubmit(password)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-6 gap-4 w-[464px] bg-white shadow-lg rounded-2xl">
      <input
        type="text"
        name="username"
        autoComplete="username"
        defaultValue="presentation-password"
        className="hidden"
      />

      <div className="flex flex-col gap-3">
        <FileCardHeader name={file.name} size={file.size} />
        <PasswordInput
          disabled={isSubmitting}
          error={error}
          onFocus={onPasswordFocus}
        />
      </div>
      <ActionButtons
        onCancel={onCancel}
        isLoading={isSubmitting}
      />
    </form>
  )
}

export { LoadingView } from "@/components/loading"
