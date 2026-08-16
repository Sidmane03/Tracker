import React, { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: React.ReactNode
}

const widths = {
  sm: '400px',
  md: '560px',
  lg: '720px',
  xl: '900px',
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full animate-fade-in rounded-[var(--radius-xl)] flex flex-col overflow-hidden"
        style={{
          maxWidth: widths[size],
          maxHeight: '90vh',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <h2
              id="modal-title"
              className="text-base font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-[var(--radius-sm)] hover:bg-[var(--surface-2)]"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close modal"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className="flex items-center justify-end gap-2 px-6 py-4 flex-shrink-0"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
