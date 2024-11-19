"use client"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "border-2 rounded-full animate-spin",
          "border-current border-t-transparent",
          sizeClasses[size],
          className
        )}
      />
    </div>
  )
}