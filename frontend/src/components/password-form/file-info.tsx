"use client"

interface FileInfoProps {
    name: string
    size: number
}

export const FileInfo = ({ name, size }: FileInfoProps) => {

    const formatSize = (bytes: number): string => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) return '0 Bytes'
        const i = Math.floor(Math.log(bytes) / Math.log(1024))

        if (i >= sizes.length) return 'File too large'

        const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2)

        const cleanSize = formattedSize.replace(/\.?0+$/, '')

        return `${cleanSize} ${sizes[i]}`
    }


    return (
        <div className="p-4 w-[416px] bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {name}
                </h3>
                <p className="text-sm text-gray-600">{formatSize(size)}</p>
            </div>
        </div>
    )
}