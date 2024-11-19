"use client"

interface ActionButtonsProps {
  onCancel: () => void
  isLoading?: boolean
}

export const ActionButtons = ({ onCancel, isLoading }: ActionButtonsProps) => {
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
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          'Lock File'
        )}
      </button>
    </div>
  )
}