'use client'

import { useState, useEffect, useCallback } from 'react'

const WALLPAPERS = [
  { id: 'yosemite-default', label: 'Yosemite', src: '/wallpapers/yosemite-default.jpg' },
  { id: 'yosemite-1', label: 'Yosemite 1', src: '/wallpapers/yosemite-1.jpg' },
  { id: 'yosemite-2', label: 'Yosemite 2', src: '/wallpapers/yosemite-2.jpg' },
  { id: 'yosemite-4', label: 'Yosemite 4', src: '/wallpapers/yosemite-4.jpg' },
]

export { WALLPAPERS }

interface ContextMenuProps {
  x: number
  y: number
  currentWallpaper: string
  onChangeWallpaper: (src: string) => void
  onClose: () => void
  playClick?: () => void
}

export default function DesktopContextMenu({
  x, y, currentWallpaper, onChangeWallpaper, onClose, playClick,
}: ContextMenuProps) {
  const [showWallpapers, setShowWallpapers] = useState(false)

  // Close on outside click or Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Clamp position so menu stays on screen
  const menuWidth = 200
  const menuHeight = showWallpapers ? 320 : 40
  const clampedX = Math.min(x, window.innerWidth - menuWidth - 8)
  const clampedY = Math.min(y, window.innerHeight - menuHeight - 8)

  return (
    <>
      {/* Invisible overlay to close menu on click outside */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
        onClick={onClose}
        onContextMenu={(e) => { e.preventDefault(); onClose() }}
      />

      {/* Menu */}
      <div
        style={{
          position: 'fixed',
          left: clampedX,
          top: clampedY,
          zIndex: 9999,
          minWidth: menuWidth,
          background: 'rgba(246, 246, 246, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 6,
          border: '1px solid rgba(0, 0, 0, 0.15)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2), 0 0 0 0.5px rgba(0, 0, 0, 0.1)',
          padding: '4px 0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 13,
          color: '#222',
          userSelect: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Change Wallpaper item */}
        <MenuItem
          label="Change Wallpaper"
          hasSubmenu
          onMouseEnter={() => setShowWallpapers(true)}
          onClick={() => {
            playClick?.()
            setShowWallpapers(s => !s)
          }}
        />

        {/* Wallpaper grid (inline submenu) */}
        {showWallpapers && (
          <div style={{
            padding: '8px 10px',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 6,
            }}>
              {WALLPAPERS.map(wp => {
                const isActive = currentWallpaper === wp.src
                return (
                  <button
                    key={wp.id}
                    onClick={() => {
                      playClick?.()
                      onChangeWallpaper(wp.src)
                      onClose()
                    }}
                    title={wp.label}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 4,
                      border: isActive ? '2px solid #007AFF' : '1px solid rgba(0,0,0,0.12)',
                      padding: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      background: 'transparent',
                      outline: 'none',
                      boxShadow: isActive ? '0 0 0 1px #007AFF' : 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                  >
                    <img
                      src={wp.src}
                      alt={wp.label}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function MenuItem({
  label, hasSubmenu, onClick, onMouseEnter,
}: {
  label: string
  hasSubmenu?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); onMouseEnter?.() }}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '4px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'default',
        background: hovered ? '#007AFF' : 'transparent',
        color: hovered ? '#fff' : '#222',
        borderRadius: hovered ? 4 : 0,
        margin: hovered ? '0 4px' : 0,
        transition: 'background 0.1s',
      }}
    >
      <span>{label}</span>
      {hasSubmenu && <span style={{ fontSize: 10, opacity: 0.6 }}>▸</span>}
    </div>
  )
}
