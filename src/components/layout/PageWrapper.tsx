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
    <header className="h-14 px-6 flex items-center justify-between flex-shrink-0 bg-[var(--surface-1)] border-b border-[var(--border)]">
      <div>
        <h1 className="text-base font-semibold leading-tight text-[var(--text-primary)]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5 text-[var(--text-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>

    {/* ── Scrollable body */}
    <main className="flex-1 overflow-y-auto bg-[var(--surface-0)] p-5 sm:p-6">
      {children}
    </main>
  </div>
)
