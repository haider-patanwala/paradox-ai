"use client"
import { useEffect, useRef, useState } from "react"
import "@vidstack/react/player/styles/base.css"
import {
  MediaPlayer,
  type MediaPlayerInstance,
  MediaProvider,
  type MediaProviderAdapter,
  PlayButton,
  isYouTubeProvider,
} from "@vidstack/react"

import { Video } from "@/lib/store"
import { BsPlayCircle } from "react-icons/bs"
import { VideoLayout } from "./video-layout"
type playerProps = {
  video_src?: string
}

// eslint-disable-next-line no-unused-vars
let currentPlayingPlayer: MediaPlayerInstance | null = null

const Player: React.FC<playerProps> = ({ video_src }) => {
  const [started, setStarted] = useState<boolean>(false)
  const { setCompleted, setOngoing, ongoing, canPlay, setCanPlay } = Video()

  let player = useRef<MediaPlayerInstance>(null)
  function onProviderChange(provider: MediaProviderAdapter | null) {
    if (isYouTubeProvider(provider)) {
      provider.cookies = false
    }
  }
  useEffect(() => {
    if (player.current && canPlay && ongoing) {
      player.current.play()
      currentPlayingPlayer = player.current
    }
    if (player.current && canPlay && !ongoing) {
      player.current.pause()
    }
  }, [ongoing, canPlay])

  return (
    <MediaPlayer
      playsInline
      title="Sprite Fight"
      src={video_src || "https://www.youtube.com/watch?v=gxc5kvzoddE"}
      className="aspect-video w-full overflow-hidden rounded-md bg-slate-900 font-sans text-white ring-media-focus data-[focus]:ring-4"
      crossOrigin
      onProviderChange={onProviderChange}
      ref={player}
      onCanPlay={() => {
        setStarted(false), setCanPlay(true)
      }}
      onPlay={() => {
        setStarted(true)
        setOngoing(true)
      }}
      onSourcesChange={() => {
        setCanPlay(false)
        setStarted(false)
        setOngoing(false)
      }}
      onPause={() => setOngoing(false)}
      onEnded={() => {
        setCompleted(true)
        setStarted(false)
      }}
    >
      <MediaProvider />
      {!started ? (
        <>
          <PlayButton
            disabled={!canPlay}
            className={"absolute z-10 h-full w-full bg-black dark:bg-theme-50"}
          >
            <BsPlayCircle className="m-auto size-[5rem] text-stone-100" />
          </PlayButton>
        </>
      ) : (
        <VideoLayout />
      )}
      {/* <VideoLayout /> */}
    </MediaPlayer>
  )
}
export default Player
