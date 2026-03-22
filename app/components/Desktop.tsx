'use client'

import { useCallback, useState } from 'react'
import BootSequence from './BootSequence'
import DesktopContextMenu from './DesktopContextMenu'
import Dock, { type DockEntry } from './Dock'
import MenuBar from './MenuBar'
import Window from './Window'
import AboutWindow from './windows/AboutWindow'
import ContactWindow from './windows/ContactWindow'
import FaceTimeWindow from './windows/FaceTimeWindow'
import ProjectsWindow from './windows/ProjectsWindow'
import ResumeViewer from './windows/ResumeViewer'
import SpotifyWidget from './windows/SpotifyWidget'
import VideoPlayer from './windows/VideoPlayer'
import YouTubePlayer from './windows/YouTubePlayer'
import { useRetroSound } from './hooks/useRetroSound'
import { useWindowManager } from './hooks/useWindowManager'

/* ── Window configs ──────────────────────────────────────── */
const CONFIGS = {
  about:    { defaultPosition: { x: 80,  y: 40  }, defaultSize: { w: 480, h: 560 } },
  projects: { defaultPosition: { x: 180, y: 50  }, defaultSize: { w: 540, h: 500 } },
  contact:  { defaultPosition: { x: 140, y: 80  }, defaultSize: { w: 380, h: 420 } },
  spotify:  { defaultPosition: { x: 520, y: 50  }, defaultSize: { w: 300, h: 380 } },
  resume:   { defaultPosition: { x: 160, y: 50  }, defaultSize: { w: 560, h: 560 } },
  video:    { defaultPosition: { x: 240, y: 60  }, defaultSize: { w: 480, h: 380 } },
  facetime: { defaultPosition: { x: 200, y: 100 }, defaultSize: { w: 600, h: 400 } },
  zenith:   { defaultPosition: { x: 140, y: 40  }, defaultSize: { w: 680, h: 460 } },
}

/* ── Window-to-app-name mapping ──────────────────────────── */
const APP_NAMES: Record<string, string> = {
  about: 'About Me',
  projects: 'Finder',
  contact: 'Contacts',
  spotify: 'Spotify',
  resume: 'Preview',
  video: 'QuickTime Player',
  facetime: 'FaceTime',
  zenith: 'QuickTime Player',
}

const DOCK_APPS: (Omit<DockEntry, 'isOpen'> & { key: string })[] = [
  {
    key: 'about', id: 'about', label: 'About Me',
    icon: <img src="/yosemite-icons/Contacts.png" alt="About Me" style={{ width: 46, height: 46 }} />,
  },
  {
    key: 'projects', id: 'projects', label: 'Projects',
    icon: <img src="/yosemite-icons/Finder.png" alt="Projects" style={{ width: 46, height: 46 }} />,
  },
  {
    key: 'contact', id: 'contact', label: 'Contact',
    icon: <img src="/yosemite-icons/Messages.png" alt="Contact" style={{ width: 46, height: 46 }} />,
  },
  {
    key: 'facetime', id: 'facetime', label: 'FaceTime',
    icon: <img src="/yosemite-icons/AppIcon.png" alt="FaceTime" style={{ width: 46, height: 46 }} />,
  },
  {
    key: 'spotify', id: 'spotify', label: 'Spotify',
    icon: <img src="/yosemite-icons/spotify.png" alt="Spotify" style={{ width: 46, height: 46 }} />,
  },
]

const DOCK_FILES: (Omit<DockEntry, 'isOpen'> & { key: string })[] = [
  {
    key: 'video', id: 'video', label: 'Work Demo.mov',
    icon: <img src="/yosemite-icons/MovieFolderIcon.png" alt="Video" style={{ width: 46, height: 46 }} />,
  },
]

/* ── Desktop ─────────────────────────────────────────────── */
export default function Desktop() {
  const [booted, setBooted] = useState(false)
  const [muted, setMuted] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [wallpaper, setWallpaper] = useState('/wallpapers/yosemite-default.jpg')
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const sound = useRetroSound()
  const wm = useWindowManager(CONFIGS)

  const open = useCallback((id: string) => {
    if (wm.windows[id]?.isOpen) {
      wm.focusWindow(id)
      setActive(id)
    } else {
      sound.playWindowOpen()
      wm.openWindow(id)
      setActive(id)
    }
  }, [sound, wm])

  const close = useCallback((id: string) => {
    sound.playWindowClose()
    wm.closeWindow(id)
    if (active === id) setActive(null)
  }, [sound, wm, active])

  const focus = useCallback((id: string) => {
    wm.focusWindow(id)
    setActive(id)
  }, [wm])

  const toggleMute = useCallback(() => {
    const n = !muted
    setMuted(n)
    sound.setMuted(n)
  }, [muted, sound])

  const wp = (id: string) => ({
    title: APP_NAMES[id] || id,
    isOpen: wm.windows[id]?.isOpen ?? false,
    position: wm.windows[id]?.position ?? { x: 0, y: 0 },
    size: wm.windows[id]?.size ?? { w: 400, h: 400 },
    zIndex: wm.windows[id]?.zIndex ?? 100,
    isActive: active === id,
    onClose: () => close(id),
    onFocus: () => focus(id),
    onMove: (x: number, y: number) => wm.moveWindow(id, x, y),
  })

  const activeAppName = active ? (APP_NAMES[active] || 'Finder') : 'Finder'
  const dockApps: DockEntry[] = DOCK_APPS.map(a => ({ ...a, isOpen: wm.windows[a.id]?.isOpen }))
  const dockFiles: DockEntry[] = DOCK_FILES.map(f => ({ ...f, isOpen: wm.windows[f.id]?.isOpen }))

  return (
    <>
      {!booted && <BootSequence onComplete={() => setBooted(true)} playBoot={sound.playBoot} />}

      {booted && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            background: `url(${wallpaper}) center/cover no-repeat`,
            animation: 'fadeIn 0.5s ease-out',
          }}
          onClick={() => { setActive(null); setContextMenu(null) }}
          onContextMenu={(e) => {
            e.preventDefault()
            setContextMenu({ x: e.clientX, y: e.clientY })
          }}
        >
          <MenuBar isMuted={muted} onToggleMute={toggleMute} activeApp={activeAppName} />

          {/* Desktop Icons */}
          <div style={{
            position: 'absolute',
            top: 40,
            right: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            alignItems: 'center',
            zIndex: 10,
          }}>
            <div
              onDoubleClick={(e) => {
                e.stopPropagation()
                open('resume')
              }}
              onClick={(e) => {
                e.stopPropagation()
                setActive('resume-icon')
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                cursor: 'default',
                width: 72,
                padding: 4,
                borderRadius: 4,
                background: active === 'resume-icon' ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
                border: `1px solid ${active === 'resume-icon' ? 'rgba(255, 255, 255, 0.2)' : 'transparent'}`,
              }}
            >
              <img 
                src="/yosemite-icons/pdf-file-icon.png" 
                alt="Resume" 
                style={{ 
                  width: 56, 
                  height: 56, 
                  objectFit: 'contain',
                  filter: active === 'resume-icon' ? 'brightness(0.8)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' 
                }} 
              />
              <span style={{
                color: '#fff',
                fontSize: 12,
                fontWeight: 500,
                textShadow: active === 'resume-icon' ? 'none' : '0 1px 2px rgba(0,0,0,0.8)',
                textAlign: 'center',
                lineHeight: 1.2,
                background: active === 'resume-icon' ? '#0058d0' : 'transparent',
                padding: '2px 6px',
                borderRadius: 4,
                width: 'max-content',
              }}>
                Resume.pdf
              </span>
            </div>

            <div
              onDoubleClick={(e) => {
                e.stopPropagation()
                open('zenith')
              }}
              onClick={(e) => {
                e.stopPropagation()
                setActive('zenith-icon')
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                cursor: 'default',
                width: 72,
                padding: 4,
                borderRadius: 4,
                background: active === 'zenith-icon' ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
                border: `1px solid ${active === 'zenith-icon' ? 'rgba(255, 255, 255, 0.2)' : 'transparent'}`,
              }}
            >
              <img
                src="/yosemite-icons/zenith.png"
                alt="Zenith"
                style={{
                  width: 56,
                  height: 56,
                  objectFit: 'contain',
                  filter: active === 'zenith-icon' ? 'brightness(0.8)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))'
                }}
              />
              <span style={{
                color: '#fff',
                fontSize: 12,
                fontWeight: 500,
                textShadow: active === 'zenith-icon' ? 'none' : '0 1px 2px rgba(0,0,0,0.8)',
                textAlign: 'center',
                lineHeight: 1.2,
                background: active === 'zenith-icon' ? '#0058d0' : 'transparent',
                padding: '2px 6px',
                borderRadius: 4,
                width: 'max-content',
              }}>
                zenith.mov
              </span>
            </div>
          </div>

          {/* Window layer */}
          <div style={{ position: 'absolute', top: 24, left: 0, right: 0, bottom: 56 }}>
            <Window {...wp('about')}><AboutWindow /></Window>
            <Window {...wp('projects')}><ProjectsWindow /></Window>
            <Window {...wp('contact')}><ContactWindow /></Window>
            <Window {...wp('facetime')}><FaceTimeWindow /></Window>
            <Window {...wp('spotify')}><SpotifyWidget /></Window>
            <Window {...wp('resume')}><ResumeViewer /></Window>
            <Window {...wp('video')}><VideoPlayer filename="work_demo.mov" /></Window>
            <Window {...wp('zenith')}><YouTubePlayer videoId="gp_9BBiFmyQ" filename="zenith.mov" /></Window>
          </div>

          {contextMenu && (
            <DesktopContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              currentWallpaper={wallpaper}
              onChangeWallpaper={setWallpaper}
              onClose={() => setContextMenu(null)}
              playClick={sound.playClick}
            />
          )}

          <Dock apps={dockApps} files={dockFiles} onOpen={open} />
        </div>
      )}
    </>
  )
}
