'use client'

import { useState, useEffect } from 'react'

export default function MobileGate() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowAlert(true), 2400)
    return () => clearTimeout(t)
  }, [])

  return (
      <div
        className="mobile-gate-screen"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'var(--wallpaper)',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Frosted overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(40px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.5)',
            background: 'rgba(0,0,0,0.15)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            paddingTop: '15vh',
          }}
        >
          {/* Time */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 200,
              color: '#fff',
              letterSpacing: '-2px',
              lineHeight: 1,
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
              animation: 'fadeIn 1s ease-out',
            }}
          >
            {time}
          </div>

          {/* Date */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.85)',
              marginTop: '8px',
              letterSpacing: '0.5px',
              textShadow: '0 1px 3px rgba(0,0,0,0.25)',
              animation: 'fadeIn 1s ease-out 0.3s both',
            }}
          >
            {date}
          </div>

          {/* Profile avatar + name */}
          <div
            style={{
              marginTop: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'fadeIn 0.8s ease-out 0.8s both',
            }}
          >
            <div
              style={{
                marginTop: '12px',
                fontSize: '17px',
                fontWeight: 500,
                color: '#fff',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              Shivansh Pandey
            </div>
          </div>

          {/* macOS Alert Dialog */}
          {showAlert && (
            <div
              style={{
                marginTop: '40px',
                width: 'calc(100% - 48px)',
                maxWidth: '320px',
                animation: 'scaleIn 0.25s ease-out',
              }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(30px) saturate(1.6)',
                  WebkitBackdropFilter: 'blur(30px) saturate(1.6)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(0,0,0,0.08)',
                }}
              >
                <div
                  style={{
                    padding: '24px 20px 20px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1d1d1f',
                      marginBottom: '6px',
                    }}
                  >
                    Desktop Required
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#6e6e73',
                      lineHeight: 1.45,
                    }}
                  >
                    Shivansh&apos;s desktop experience was designed for larger screens. Please visit from a Mac or PC to explore the full experience.
                  </div>
                </div>

                <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.12)' }} />

                <button
                  onClick={() => setShowAlert(false)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#007AFF',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  OK
                </button>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.3px',
                  animation: 'fadeIn 1s ease-out 0.5s both',
                }}
              >
                shivansh.life works best on desktop
              </div>
            </div>
          )}

        </div>
      </div>
  )
}
