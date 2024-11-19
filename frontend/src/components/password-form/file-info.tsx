"use client"

import { FileCardHeader } from "@/components/shared/file-card-header"

interface FileInfoProps {
    name: string
    size: number
}

export const FileInfo = ({ name, size }: FileInfoProps) => {
    return <FileCardHeader name={name} size={size} />
}