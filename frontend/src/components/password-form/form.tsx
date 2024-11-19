"use client"

import * as React from "react"
import { FormEvent } from "react"
import { FileInfo } from "./file-info"
import { PasswordInput } from "./password-input"
import { ActionButtons } from "./action-buttons"

interface PasswordFormProps {
  file: File
  onCancel: () => void
  onSubmit: (password: string) => Promise<void>
  isSubmitting?: boolean
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  file,
  onCancel,
  onSubmit,
  isSubmitting = false
}) => {
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
        <FileInfo name={file.name} size={file.size} />
        <PasswordInput disabled={isSubmitting} />
      </div>
      <ActionButtons
        onCancel={onCancel}
        isLoading={isSubmitting}
      />
    </form>
  )
}