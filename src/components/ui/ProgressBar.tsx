import React from 'react'

interface ProgressBarProps {
  value: number          // 0-100
  color?: string         // Custom hex or var()
  height?: number        // px
  tall?: boolean         // Preset taller bar (8px)
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
  color,
  height,
  tall = false,
  showLabel = false,
  animate = true,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  const barColor = color || resolveColor(clamped)
  const barHeight = height ?? (tall ? 8 : 6)

  return (
    <div className={`w-full ${className}`}>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: barHeight, background: 'var(--surface-3)' }}
      >
        <div
          className={animate ? 'h-full rounded-full transition-all duration-500 ease-out' : 'h-full rounded-full'}
          style={{ width: `${clamped}%`, background: barColor }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-end mt-1">
          <span className="mono text-xs text-[var(--text-muted)]">
            {clamped}%
          </span>
        </div>
      )}
    </div>
  )
}
