import React from 'react'

interface ProgressBarProps {
  value: number          // 0-100
  height?: number        // px
  showLabel?: boolean
  animate?: boolean
  className?: string
}

function resolveColor(value: number): string {
  if (value >= 80) return 'var(--success)'
  if (value >= 55) return 'var(--accent)'
  if (value >= 30) return 'var(--warning)'
  return 'var(--danger)'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 6,
  showLabel = false,
  animate = true,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  const color = resolveColor(clamped)

  return (
    <div className={`w-full ${className}`}>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, background: 'var(--surface-3)' }}
      >
        <div
          className={animate ? 'h-full rounded-full transition-all duration-700 ease-out' : 'h-full rounded-full'}
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-end mt-1">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {clamped}%
          </span>
        </div>
      )}
    </div>
  )
}
