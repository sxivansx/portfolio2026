'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  videoId: string
  filename: string
}

declare global {
  interface Window {
    YT: typeof YT
    onYouTubeIframeAPIReady: () => void
  }
}

export default function YouTubePlayer({ videoId, filename }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: (e: YT.PlayerEvent) => {
            setDuration(e.target.getDuration())
            e.target.setVolume(80)
          },
          onStateChange: (e: YT.OnStateChangeEvent) => {
            const playing = e.data === window.YT.PlayerState.PLAYING
            setIsPlaying(playing)
            if (playing) {
              setDuration(e.target.getDuration())
              intervalRef.current = setInterval(() => {
                if (playerRef.current) setProgress(playerRef.current.getCurrentTime())
              }, 250)
            } else if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
          },
        },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      playerRef.current?.destroy()
    }
  }, [videoId])

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return
    if (isPlaying) playerRef.current.pauseVideo()
    else playerRef.current.playVideo()
  }, [isPlaying])

  const seek = useCallback((time: number) => {
    playerRef.current?.seekTo(time, true)
    setProgress(time)
  }, [])

  const changeVolume = useCallback((v: number) => {
    setVolume(v)
    playerRef.current?.setVolume(v)
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* QuickTime-style controls */}
      <div style={{
        padding: '6px 12px 8px',
        background: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums', minWidth: 30 }}>
            {formatTime(progress)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={e => seek(parseFloat(e.target.value))}
            style={{
              flex: 1,
              height: 3,
              appearance: 'none',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 2,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums', minWidth: 30, textAlign: 'right' }}>
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={e => changeVolume(parseInt(e.target.value))}
              style={{
                width: 50,
                height: 3,
                appearance: 'none',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>

          {/* Rewind 10s */}
          <button onClick={() => seek(Math.max(0, progress - 10))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
              <path d="M19 20L9 12l10-8v16z" />
              <path d="M5 19V5" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button onClick={togglePlay} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
                <polygon points="6 3 20 12 6 21" />
              </svg>
            )}
          </button>

          {/* Fast Forward 10s */}
          <button onClick={() => seek(Math.min(duration, progress + 10))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
              <path d="M5 4l10 8-10 8V4z" />
              <path d="M19 5v14" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
            </svg>
          </button>

          {/* Share / Open on YouTube */}
          <button
            onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>
        </div>

        {/* Filename */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{filename}</span>
        </div>
      </div>
    </div>
  )
}
