'use client'

import { useState } from 'react'
import { PORTFOLIO_CONTENT } from '../../content'

export default function ResumeViewer() {
  const [zoom, setZoom] = useState(100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 12px',
        background: '#ececec',
        borderBottom: '1px solid #d4d4d4',
        gap: 8,
        flexShrink: 0,
      }}>
        <ToolbarButton label="-" onClick={() => setZoom(z => Math.max(50, z - 25))} />
        <span style={{
          fontSize: 11,
          color: 'var(--color-text-secondary)',
          minWidth: 36,
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {zoom}%
        </span>
        <ToolbarButton label="+" onClick={() => setZoom(z => Math.min(200, z + 25))} />
        <div style={{ flex: 1 }} />
        <ToolbarButton label="Print" onClick={() => window.print()} />
        <a
          href={PORTFOLIO_CONTENT.contact.cv}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            color: '#333',
            textDecoration: 'none',
            padding: '2px 10px',
            borderRadius: 4,
            border: '1px solid #ccc',
            background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
            boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
            lineHeight: '18px',
          }}
        >
          Download
        </a>
      </div>

      {/* Resume content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        background: '#525659',
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
      }}>
        <div style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease',
        }}>
          <ResumeContent />
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        color: '#333',
        background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: '2px 10px',
        cursor: 'pointer',
        lineHeight: '18px',
        boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
      }}
    >
      {label}
    </button>
  )
}

function ResumeContent() {
  const { resume, experience, education, contact } = PORTFOLIO_CONTENT

  return (
    <div style={{
      width: 540,
      background: '#fff',
      padding: '36px 40px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
      fontSize: 11.5,
      color: '#222',
      lineHeight: 1.55,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px 0', color: '#111' }}>
        {resume.fullName}
      </h1>
      <p style={{ fontSize: 10.5, color: '#555', margin: '0 0 16px 0' }}>
        {resume.location} | {contact.email} | {resume.phone} |{' '}
        <a href={`https://${contact.linkedin}`} style={{ color: '#555' }}>LinkedIn</a> |{' '}
        <a href={`https://${contact.behance}`} style={{ color: '#555' }}>Behance</a>
      </p>

      {/* Summary */}
      <Section title="Summary">
        <p style={{ margin: 0 }}>{resume.summary}</p>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <p style={{ margin: 0 }}>{resume.coreSkills.join(' \u00B7 ')}</p>
      </Section>

      {/* Tools */}
      <Section title="Tools">
        <p style={{ margin: 0 }}>{resume.resumeTools.join(' \u00B7 ')}</p>
      </Section>

      {/* Experience */}
      <Section title="Experience">
        {experience.filter(e => e.company !== 'Freelance' && e.company !== 'IICT').map(exp => (
          <div key={exp.company} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 600, fontSize: 12 }}>{exp.company}</span>
              <span style={{ fontSize: 10.5, color: '#666' }}>{exp.role}</span>
            </div>
            <ul style={{ margin: '3px 0 0', paddingLeft: 16 }}>
              {exp.highlights.map((h, i) => (
                <li key={i} style={{ fontSize: 11, color: '#444', marginBottom: 1.5 }}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* Projects */}
      <Section title="Projects">
        {resume.projects.map(proj => (
          <div key={proj.name} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 600, fontSize: 12 }}>{proj.name}</span>
              <span style={{ fontSize: 10.5, color: '#666' }}>{proj.role}</span>
            </div>
            <ul style={{ margin: '3px 0 0', paddingLeft: 16 }}>
              {proj.highlights.map((h, i) => (
                <li key={i} style={{ fontSize: 11, color: '#444', marginBottom: 1.5 }}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* Volunteering */}
      <Section title="Volunteering">
        {resume.volunteering.map(vol => (
          <div key={vol.name} style={{ marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 12 }}>{vol.name}</span>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#444' }}>{vol.description}</p>
          </div>
        ))}
      </Section>

      {/* Education */}
      <Section title="Education">
        <p style={{ margin: 0 }}>
          <span style={{ fontWeight: 600 }}>{education.institution}</span>
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#444' }}>
          Dept. of {education.field} {education.cgpa ? `\u00B7 CGPA ${education.cgpa}` : ''}
        </p>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2 style={{
        fontSize: 12,
        fontWeight: 700,
        color: '#111',
        margin: '14px 0 6px 0',
        paddingBottom: 3,
        borderBottom: '1.5px solid #222',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}>
        {title}
      </h2>
      {children}
    </>
  )
}
