import React from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FileUploadItemProps {
  fileName: string
  onDelete: () => void
}

export const FileUploadItem: React.FC<FileUploadItemProps> = ({ fileName, onDelete }) => (
  <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
    <p className="text-green-600">✓ {fileName}</p>
    <Button 
      variant="ghost"
      size="sm" 
      onClick={onDelete}
      className="hover:bg-red-100"
    >
      <X className="h-4 w-4 text-red-500" />
    </Button>
  </div>
)
