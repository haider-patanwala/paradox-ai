import { create } from 'zustand'

interface UploadedFile {
  name: string
  type: 'pdf' | 'image'
  content: File
}

interface UrlData {
  url: string
  type: 'youtube' | 'document'
  content: any
}

interface UploadStore {
  uploadedFiles: Array<{
    name: string
    type: 'pdf' | 'image'
    content: File
  }>
  addFile: (file: { name: string; type: 'pdf' | 'image'; content: File }) => void
  removeFile: (fileName: string) => void
  addUrl: (url: { url: string; type: 'youtube' | 'document'; content: any }) => void
  removeUrl: (url: string) => void
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploadedFiles: [],
  addFile: (file) => set((state) => ({
    uploadedFiles: [...state.uploadedFiles, file]
  })),
  removeFile: (fileName) => set((state) => ({
    uploadedFiles: state.uploadedFiles.filter((file) => file.name !== fileName)
  })),
  addUrl: (url) => set((state) => ({
    // Add URL handling logic here
  })),
  removeUrl: (url) => set((state) => ({
    // Add URL removal logic here
  }))
}))
