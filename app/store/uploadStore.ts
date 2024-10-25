import { create } from 'zustand'

interface UploadedFile {
  type: 'pdf' | 'image'
  name: string
  content: File
}

interface ValidUrl {
  type: 'youtube' | 'document'
  url: string
}

interface UploadStore {
  uploadedFiles: UploadedFile[]
  validUrls: ValidUrl[]
  addFile: (file: UploadedFile) => void
  addUrl: (url: ValidUrl) => void
  removeFile: (name: string) => void
  removeUrl: (url: string) => void
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploadedFiles: [],
  validUrls: [],
  addFile: (file) => set((state) => ({
    uploadedFiles: [...state.uploadedFiles, file]
  })),
  addUrl: (url) => set((state) => ({
    validUrls: [...state.validUrls, url]
  })),
  removeFile: (name) => set((state) => ({
    uploadedFiles: state.uploadedFiles.filter(file => file.name !== name)
  })),
  removeUrl: (url) => set((state) => ({
    validUrls: state.validUrls.filter(item => item.url !== url)
  }))
}))
