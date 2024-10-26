import { create } from "zustand"

interface VideoStore {
  source: string
  completed: boolean
  ongoing: boolean
  canPlay: boolean
  setSource: (source: string) => void
  setCompleted: (completed: boolean) => void
  setOngoing: (ongoing: boolean) => void
  setCanPlay: (canPlay: boolean) => void
}

export const Video = create<VideoStore>((set) => ({
  source: "",
  completed: false,
  ongoing: false,
  canPlay: false,
  setSource: (source: string) => set(() => ({ source })),
  setCompleted: (completed: boolean) => set(() => ({ completed })),
  setOngoing: (ongoing: boolean) => set(() => ({ ongoing })),
  setCanPlay: (canPlay: boolean) => set(() => ({ canPlay }))
}))
