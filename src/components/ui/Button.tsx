import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: React.ReactNode
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-md)] cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed border border-transparent'

  const variants: Record<Variant, string> = {
    primary: [
      'bg-[var(--accent)] hover:bg-[var(--accent-light)]',
      'text-white',
      'shadow-[0_0_20px_var(--accent-glow)]',
      'hover:shadow-[0_0_28px_var(--accent-glow)]',
    ].join(' '),
    secondary: [
      'bg-[var(--surface-2)] hover:bg-[var(--surface-3)]',
      'text-[var(--text-primary)]',
      '!border-[var(--border)]',
    ].join(' '),
    ghost: [
      'bg-transparent hover:bg-[var(--surface-2)]',
      'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
    ].join(' '),
    danger: [
      'bg-[var(--danger-subtle)] hover:bg-[var(--danger)]/20',
      'text-[var(--danger)]',
      '!border-[var(--danger)]/30',
    ].join(' '),
  }

  const sizes: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          className="animate-spin rounded-full border-2 border-current border-t-transparent"
          style={{ width: size === 'sm' ? 12 : 14, height: size === 'sm' ? 12 : 14 }}
        />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
