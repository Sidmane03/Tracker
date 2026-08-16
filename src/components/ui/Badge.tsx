import React from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  dot = false,
}) => {
  const styles: Record<BadgeVariant, string> = {
    default: 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)]',
    success: 'bg-[var(--success-subtle)] text-[var(--success)] border-[var(--success)]/20',
    warning: 'bg-[var(--warning-subtle)] text-[var(--warning)] border-[var(--warning)]/20',
    danger:  'bg-[var(--danger-subtle)] text-[var(--danger)] border-[var(--danger)]/20',
    info:    'bg-[var(--info-subtle)] text-[var(--info)] border-[var(--info)]/20',
    accent:  'bg-[var(--accent-subtle)] text-[var(--accent-light)] border-[var(--accent)]/20',
  }

  const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-[var(--text-muted)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    danger:  'bg-[var(--danger)]',
    info:    'bg-[var(--info)]',
    accent:  'bg-[var(--accent)]',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${styles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}
