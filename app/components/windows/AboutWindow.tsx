'use client'

import { useState } from 'react'
import { PORTFOLIO_CONTENT } from '../../content'

export default function AboutWindow() {
  const { name, role, bio, education, coCurricular } = PORTFOLIO_CONTENT
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#ececec',
    }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
        padding: '10px 0 0',
        background: '#ececec',
        borderBottom: '1px solid #d4d4d4',
      }}>
        {['Overview', 'Education', 'Co-Curricular'].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '4px 14px',
              fontSize: 11,
              background: activeTab === tab ? '#ffffff' : 'transparent',
              border: activeTab === tab ? '1px solid #d4d4d4' : '1px solid transparent',
              borderBottom: activeTab === tab ? '1px solid #ffffff' : '1px solid transparent',
              borderRadius: '4px 4px 0 0',
              marginBottom: -1,
              color: activeTab === tab ? '#333' : '#777',
              cursor: 'pointer',
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        background: '#ffffff',
        display: 'flex',
        padding: '24px 28px',
        gap: 20,
        overflowY: 'auto',
      }}>
        {/* Left Icon - smaller */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #007AFF, #5856d6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 3px 12px rgba(0, 122, 255, 0.2)',
        }}>
          <span style={{ fontSize: 32, fontWeight: 300, color: '#fff' }}>{name[0]}</span>
        </div>

        {/* Right Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h1 style={{ fontSize: 22, fontWeight: 300, color: '#333', margin: '0 0 2px 0', letterSpacing: -0.3 }}>
            {name}
          </h1>
          <p style={{ fontSize: 12, color: '#666', margin: '0 0 12px 0', fontWeight: 500 }}>
            {role}
          </p>

          <div style={{ width: '100%', height: 1, background: '#e5e5e5', margin: '0 0 12px 0' }} />

          {activeTab === 'Overview' && (
            <>
              <p style={{ fontSize: 11, lineHeight: 1.6, color: '#444', margin: '0 0 16px 0' }}>
                {bio}
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <MacButton>System Report...</MacButton>
                <MacButton>Software Update...</MacButton>
              </div>
            </>
          )}

          {activeTab === 'Education' && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#333', margin: '0 0 4px 0' }}>
                {education.institution}
              </h3>
              <p style={{ fontSize: 12, color: '#666', margin: '0 0 2px 0' }}>
                B.E. in {education.field}
              </p>
              <p style={{ fontSize: 11, color: '#888', margin: '0 0 2px 0' }}>
                {education.years}
              </p>
              {education.cgpa && (
                <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
                  CGPA: {education.cgpa}
                </p>
              )}
            </div>
          )}

          {activeTab === 'Co-Curricular' && (
            <ul style={{
              margin: 0,
              paddingLeft: 16,
              fontSize: 11,
              lineHeight: 1.8,
              color: '#444',
            }}>
              {coCurricular.map((item: string, i: number) => (
                <li key={i} style={{ marginBottom: 4 }}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function MacButton({ children }: { children: React.ReactNode }) {
  return (
    <button style={{
      padding: '3px 12px',
      fontSize: 11,
      background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
      border: '1px solid #ccc',
      borderRadius: 4,
      color: '#333',
      boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
      cursor: 'pointer',
    }}>
      {children}
    </button>
  )
}
