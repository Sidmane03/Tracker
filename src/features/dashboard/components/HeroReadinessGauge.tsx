import React from 'react'
import { BookOpen, Clock, Target, ArrowRight } from 'lucide-react'
import { Card, ProgressBar } from '@/components/ui'
import { useStore } from '@/store'
import type { DashboardMetrics } from '@/lib/engine'

interface HeroReadinessGaugeProps {
  overallReadiness: number
  metrics: DashboardMetrics
  primaryRoleTitle?: string
  onNavigateToSkills?: (categoryId?: string) => void
  onNavigateToCareer?: () => void
  onOpenQuickLog?: () => void
}

export const HeroReadinessGauge: React.FC<HeroReadinessGaugeProps> = ({
  overallReadiness,
  metrics,
  primaryRoleTitle,
  onNavigateToSkills,
  onNavigateToCareer,
  onOpenQuickLog,
}) => {
  const { categories, categoryOrder, getCategoryReadiness } = useStore()
  const score = Math.max(0, Math.min(100, Math.round(overallReadiness)))

  const tier =
    score >= 80 ? 'Interview Ready' : score >= 60 ? 'Proficient' : score >= 35 ? 'Developing' : 'Early Stage'
  const tierColor =
    score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--accent-light)' : score >= 35 ? 'var(--warning)' : 'var(--text-muted)'

  return (
    <Card className="rounded-[20px] border border-white/[0.08] bg-[var(--surface-1)] p-5 sm:p-6 space-y-6">
      {/* ── Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--text-muted)] uppercase">
            Your learning
          </p>
          <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Skill progress
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-[var(--surface-2)] text-xs font-semibold"
            style={{ color: tierColor }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tierColor }} />
            <span>{score}% Overall</span>
            <span className="text-[var(--text-muted)] font-normal">&bull;</span>
            <span className="font-medium text-[var(--text-secondary)]">{tier}</span>
          </div>

          {primaryRoleTitle && (
            <button
              onClick={onNavigateToCareer}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-[var(--surface-2)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent-light)] hover:border-white/[0.16] transition cursor-pointer font-medium"
            >
              <span>Target: {primaryRoleTitle}</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Core KPI Stats */}
      <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[var(--surface-2)] border border-white/[0.05] text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#202c44] flex items-center justify-center flex-shrink-0 text-[var(--accent-light)]">
            <BookOpen size={15} />
          </div>
          <div>
            <div className="mono font-bold text-sm text-[var(--text-primary)]">
              {metrics.activeSubtopicsCount}
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">Active Topics</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#202c44] flex items-center justify-center flex-shrink-0 text-[var(--success)]">
            <Target size={15} />
          </div>
          <div>
            <div className="mono font-bold text-sm text-[var(--text-primary)]">
              {metrics.totalProblems}
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">Solved Cleanly</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#202c44] flex items-center justify-center flex-shrink-0 text-[var(--warning)]">
            <Clock size={15} />
          </div>
          <div>
            <div className="mono font-bold text-sm text-[var(--text-primary)]">
              {metrics.totalStudyHours}h
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">Study Time</div>
          </div>
        </div>
      </div>

      {/* ── Multi-Category Skill Bars Grid (Matching Figma Skill progress) */}
      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {categoryOrder.map((cid) => {
          const cat = categories[cid]
          if (!cat) return null
          const catScore = getCategoryReadiness(cid)
          const color = `var(--${cat.color})`

          return (
            <div
              key={cid}
              role="button"
              tabIndex={0}
              onClick={() => onNavigateToSkills?.(cid)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onNavigateToSkills?.(cid)
                }
              }}
              className="group cursor-pointer"
            >
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  <span className="text-xs font-semibold text-[#dce3f5] group-hover:text-[var(--accent-light)] transition-colors truncate">
                    {cat.title}
                  </span>
                </div>
                <span className="mono text-xs font-semibold text-[#b9c4dd]">
                  {catScore}%
                </span>
              </div>
              <ProgressBar value={catScore} color={color} />
            </div>
          )
        })}
      </div>

      {/* ── Action buttons */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[var(--text-muted)]">
          {score >= 60 ? 'Great consistency — keep going!' : 'Ready to practice today.'}
        </span>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateToSkills?.()}
            className="text-[var(--text-secondary)] hover:text-white font-medium transition cursor-pointer px-2 py-1"
          >
            Curriculum →
          </button>
          <button
            type="button"
            onClick={onOpenQuickLog}
            className="rounded-lg bg-[var(--accent)] px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_6px_16px_var(--accent-glow)] transition hover:bg-[var(--accent-light)] cursor-pointer"
          >
            + Quick log
          </button>
        </div>
      </div>
    </Card>
  )
}
