import React from 'react'

interface PageWrapperProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  subtitle,
  actions,
  children,
}) => (
  <div className="flex flex-col h-full overflow-hidden">
    {/* ── Page header */}
    <header
      className="flex items-center justify-between flex-shrink-0"
      style={{
        height: 56,
        padding: '0 24px',
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div>
        <h1
          className="text-base font-semibold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>

    {/* ── Scrollable body */}
    <main
      className="flex-1 overflow-y-auto"
      style={{ background: 'var(--surface-0)', padding: '20px 24px' }}
    >
      {children}
    </main>
  </div>
)
