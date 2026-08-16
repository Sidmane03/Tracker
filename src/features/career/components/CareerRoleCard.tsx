import React from 'react'
import {
  BarChart3,
  FlaskConical,
  Cpu,
  Bot,
  Server,
  Star,
  ChevronRight,
  Target,
} from 'lucide-react'
import type { RoleReadinessSummary } from '@/lib/engine'

const ROLE_ICON_MAP: Record<string, React.ReactNode> = {
  BarChart3:    <BarChart3 size={20} />,
  FlaskConical: <FlaskConical size={20} />,
  Cpu:          <Cpu size={20} />,
  Bot:          <Bot size={20} />,
  Server:       <Server size={20} />,
}

interface CareerRoleCardProps {
  summary: RoleReadinessSummary
  isSelected: boolean
  isPrimaryTarget: boolean
  onSelectRole: (roleId: string) => void
  onTogglePrimaryTarget: (roleId: string) => void
}

export const CareerRoleCard: React.FC<CareerRoleCardProps> = ({
  summary,
  isSelected,
  isPrimaryTarget,
  onSelectRole,
  onTogglePrimaryTarget,
}) => {
  const { role, readiness, categoryBreakdowns, keyGaps } = summary
  const icon = ROLE_ICON_MAP[role.icon] ?? <Target size={20} />

  const readinessColor =
    readiness >= 75
      ? 'var(--success)'
      : readiness >= 50
      ? 'var(--accent-light)'
      : readiness >= 30
      ? 'var(--warning)'
      : 'var(--text-secondary)'

  return (
    <div
      onClick={() => onSelectRole(role.id)}
      className={`p-4 rounded-[var(--radius-xl)] border transition-all cursor-pointer flex flex-col justify-between group ${
        isSelected
          ? 'border-[var(--accent)] bg-[var(--surface-2)] shadow-[0_0_20px_var(--accent-glow)]'
          : 'border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]/60'
      }`}
    >
      <div>
        {/* ── Top Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--surface-3)] text-[var(--accent-light)] group-hover:text-white group-hover:bg-[var(--accent)]'
              }`}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-xs font-bold text-[var(--text-primary)]">
                {role.title}
              </h3>
              {isPrimaryTarget && (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.2 rounded bg-[var(--accent-subtle)] text-[var(--accent-light)] border border-[var(--accent)]/30">
                  <Star size={9} className="fill-current" />
                  Primary Goal
                </span>
              )}
            </div>
          </div>

          {/* Star Target Action */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onTogglePrimaryTarget(role.id)
            }}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              isPrimaryTarget
                ? 'text-[var(--warning)] bg-[var(--warning-subtle)]'
                : 'text-[var(--text-muted)] hover:text-[var(--warning)] hover:bg-[var(--surface-3)]'
            }`}
            title={isPrimaryTarget ? 'Active Primary Target (Click to unset)' : 'Set as Primary Career Target'}
          >
            <Star size={14} className={isPrimaryTarget ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Description */}
        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 mb-3">
          {role.description}
        </p>

        {/* Readiness Gauge & Score */}
        <div className="p-2.5 rounded-lg bg-[var(--surface-1)] border border-[var(--border)] mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[var(--text-secondary)] text-[11px]">Role Readiness:</span>
            <span className="font-mono font-extrabold text-sm" style={{ color: readinessColor }}>
              {readiness}%
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 5, background: 'var(--surface-3)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${readiness}%`,
                background: readinessColor,
              }}
            />
          </div>
        </div>

        {/* Top 3 Weighted Domains */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[var(--text-muted)]">
            Domain Weights:
          </span>
          {categoryBreakdowns.slice(0, 3).map((b) => (
            <div key={b.categoryId} className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--text-secondary)] truncate max-w-[120px]">
                {b.categoryTitle}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[var(--text-muted)]">
                  {Math.round(b.weight * 100)}% wt
                </span>
                <span
                  className="font-mono font-medium text-[10px]"
                  style={{
                    color: b.readiness >= 70 ? 'var(--success)' : b.readiness >= 40 ? 'var(--accent-light)' : 'var(--warning)',
                  }}
                >
                  {b.readiness}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Gaps summary */}
      <div className="mt-4 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[11px]">
        {keyGaps.length > 0 ? (
          <span className="text-[var(--warning)] text-[10px]">
            {keyGaps.length} domain gap{keyGaps.length > 1 ? 's' : ''} to bridge
          </span>
        ) : (
          <span className="text-[var(--success)] text-[10px]">
            Strong domain coverage
          </span>
        )}

        <span className="text-[var(--accent-light)] flex items-center gap-0.5 text-[10px] font-medium group-hover:translate-x-0.5 transition-transform">
          <span>Gap Analysis</span>
          <ChevronRight size={11} />
        </span>
      </div>
    </div>
  )
}
