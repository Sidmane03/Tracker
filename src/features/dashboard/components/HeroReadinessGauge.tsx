import React from 'react'
import { BookOpen, Clock, Target, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui'
import type { DashboardMetrics } from '@/lib/engine'

interface HeroReadinessGaugeProps {
  overallReadiness: number
  metrics: DashboardMetrics
  primaryRoleTitle?: string
  onNavigateToSkills?: () => void
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
  const score = Math.max(0, Math.min(100, Math.round(overallReadiness)))

  // SVG Gauge calculations
  const size = 96
  const strokeWidth = 7
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const tier =
    score >= 80 ? 'Interview Ready' : score >= 60 ? 'Proficient' : score >= 35 ? 'Developing' : 'Early Stage'
  const tierVariant =
    score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--accent-light)' : score >= 35 ? 'var(--warning)' : 'var(--text-muted)'

  return (
    <Card className="flex flex-col md:flex-row items-center gap-8 transition-all p-6">
      {/* ── Left: Circular Radial Gauge */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div
          className="relative flex items-center justify-center"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Overall learning readiness: ${score}%`}
        >
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--surface-3)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={tierVariant}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span className="text-xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
              {score}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Middle: Overall Readiness & Clean Minimal Metrics */}
      <div className="flex-1 min-w-0 text-center md:text-left space-y-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
              Learning Readiness
            </h2>
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-[var(--radius-sm)] border"
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--border)',
                color: tierVariant,
              }}
            >
              {tier}
            </span>

            {primaryRoleTitle && (
              <button
                onClick={onNavigateToCareer}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-light)] flex items-center gap-1 cursor-pointer font-medium transition-colors"
              >
                <span>{primaryRoleTitle}</span>
                <ArrowRight size={11} />
              </button>
            )}
          </div>
        </div>

        {/* ── KPI Row */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs pt-1 border-t border-[var(--border)]">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <BookOpen size={13} className="text-[var(--text-muted)]" />
            <span className="font-semibold text-[var(--text-primary)]">{metrics.activeSubtopicsCount}</span>
            <span className="text-[var(--text-muted)]">Active Topics</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Target size={13} className="text-[var(--text-muted)]" />
            <span className="font-semibold text-[var(--text-primary)]">{metrics.totalProblems}</span>
            <span className="text-[var(--text-muted)]">Solved</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Clock size={13} className="text-[var(--text-muted)]" />
            <span className="font-semibold text-[var(--text-primary)]">{metrics.totalStudyHours}h</span>
            <span className="text-[var(--text-muted)]">Study Time</span>
          </div>
        </div>
      </div>

      {/* ── Right: Quiet Action Buttons */}
      <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0 w-full md:w-auto">
        <button
          onClick={onOpenQuickLog}
          className="px-4 py-2 text-xs font-semibold rounded-[var(--radius-sm)] bg-[var(--accent)] text-white hover:opacity-90 transition-all cursor-pointer text-center"
        >
          Quick Log
        </button>
        <button
          onClick={onNavigateToSkills}
          className="px-4 py-2 text-xs font-medium rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-strong)] transition-all cursor-pointer text-center"
        >
          Curriculum
        </button>
      </div>
    </Card>
  )
}
