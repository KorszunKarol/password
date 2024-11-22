
/**
 * Formats a number of bytes into a human-readable size string
 * @param bytes - The number of bytes to format
 * @returns A string representing the size in bytes, KB, MB, GB, or TB
 */
export const formatSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))

    if (i >= sizes.length) return 'File too large'

    const formattedSize = (bytes / Math.pow(1024, i)).toFixed(2)
    const cleanSize = formattedSize.replace(/\.?0+$/, '')

    return `${cleanSize} ${sizes[i]}`
}