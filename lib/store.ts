import { create } from "zustand"

interface VideoStore {
  completed: boolean
  ongoing: boolean
  canPlay: boolean
  setCompleted: (completed: boolean) => void
  setOngoing: (ongoing: boolean) => void
  setCanPlay: (canPlay: boolean) => void
}

export const Video = create<VideoStore>((set) => ({
  completed: false,
  ongoing: false,
  canPlay: false,
  setCompleted: (completed: boolean) => set(() => ({ completed })),
  setOngoing: (ongoing: boolean) => set(() => ({ ongoing })),
  setCanPlay: (canPlay: boolean) => set(() => ({ canPlay }))
}))
