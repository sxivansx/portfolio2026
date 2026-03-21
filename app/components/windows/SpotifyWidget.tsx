'use client'

import { useCallback, useEffect, useState } from 'react'

interface TrackData {
  isPlaying: boolean
  track: string | null
  artist: string | null
  albumArt: string | null
  progress: number
  duration: number
  url: string | null
}

export default function SpotifyWidget() {
  const [data, setData] = useState<TrackData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTrack = useCallback(async () => {
    try {
      const res = await fetch('/api/spotify')
      if (res.ok) setData(await res.json())
    } catch {
      /* silently fail */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrack()
    const id = setInterval(fetchTrack, 10_000)
    return () => clearInterval(id)
  }, [fetchTrack])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--color-text-tertiary)',
        fontSize: 12,
      }}>
        Connecting to Spotify...
      </div>
    )
  }

  if (!data?.track) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 8,
        color: 'var(--color-text-tertiary)',
      }}>
        <img src="/yosemite-icons/spotify.png" alt="Spotify" style={{ width: 32, height: 32, opacity: 0.5, filter: 'grayscale(100%)' }} />
        <span style={{ fontSize: 12 }}>Nothing playing right now</span>
      </div>
    )
  }

  const progressPct = data.duration > 0 ? (data.progress / data.duration) * 100 : 0
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
      {/* Album art */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1',
        maxHeight: 200,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {data.albumArt ? (
          <img
            src={data.albumArt}
            alt="Album art"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #A6D95A, #85B839)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img src="/yosemite-icons/spotify.png" alt="Spotify" style={{ width: 48, height: 48, opacity: 0.5 }} />
          </div>
        )}

        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '3px 8px',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          borderRadius: 10,
        }}>
          {data.isPlaying && (
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#A6D95A',
              animation: 'pulse 1.5s ease infinite',
            }} />
          )}
          <span style={{ fontSize: 10, color: 'var(--color-text-inverse)', fontWeight: 500 }}>
            {data.isPlaying ? 'Now Playing' : 'Recently Played'}
          </span>
        </div>
      </div>

      {/* Track info */}
      <div style={{ padding: '14px 16px', flex: 1 }}>
        <h3 style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          margin: '0 0 2px 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {data.track}
        </h3>
        <p style={{
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          margin: '0 0 12px 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {data.artist}
        </p>

        {data.isPlaying && (
          <div>
            <div style={{
              width: '100%',
              height: 3,
              borderRadius: 2,
              background: 'var(--color-border-light)',
              overflow: 'hidden',
              marginBottom: 4,
            }}>
              <div style={{
                width: `${progressPct}%`,
                height: '100%',
                borderRadius: 2,
                background: '#A6D95A',
                transition: 'width 1s linear',
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 9,
              color: 'var(--color-text-tertiary)',
            }}>
              <span>{formatTime(data.progress)}</span>
              <span>{formatTime(data.duration)}</span>
            </div>
          </div>
        )}

        {data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              fontSize: 11,
              color: '#A6D95A',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <img src="/yosemite-icons/spotify.png" alt="Spotify" style={{ width: 14, height: 14 }} />
            Open in Spotify
          </a>
        )}
      </div>
    </div>
  )
}
