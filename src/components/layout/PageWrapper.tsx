import React from 'react'

interface PageWrapperProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  hideHeader?: boolean
  children: React.ReactNode
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  subtitle,
  actions,
  hideHeader = false,
  children,
}) => (
  <div className="flex flex-col h-full overflow-hidden bg-[#0a1020]">
    {/* ── Page header (rendered only if not hidden) */}
    {!hideHeader && title && (
      <header className="h-14 px-6 flex items-center justify-between flex-shrink-0 bg-[#0c1426] border-b border-white/[0.08]">
        <div>
          <h1 className="text-base font-semibold leading-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs mt-0.5 text-[#8290aa]">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
    )}

    {/* ── Scrollable body */}
    <main className="flex-1 overflow-y-auto dashboard-scroll px-5 pt-6 pb-24 sm:px-8 lg:px-10 lg:pt-9 lg:pb-12">
      {children}
    </main>
  </div>
)
