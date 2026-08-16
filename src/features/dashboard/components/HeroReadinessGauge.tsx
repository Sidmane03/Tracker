import React from 'react'
import { Zap, Award, Target, BookOpen, Clock, Compass } from 'lucide-react'
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

  // SVG Circular Gauge parameters
  const size = 180
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  // Visual Health Tier
  const tier =
    score >= 80
      ? { label: 'Interview Ready', color: 'var(--success)', glow: 'var(--success-subtle)' }
      : score >= 60
      ? { label: 'Proficient', color: 'var(--accent)', glow: 'var(--accent-glow)' }
      : score >= 35
      ? { label: 'Developing', color: 'var(--warning)', glow: 'var(--warning-subtle)' }
      : { label: 'Early Stage', color: 'var(--text-secondary)', glow: 'var(--surface-3)' }

  return (
    <div
      className="p-6 rounded-[var(--radius-xl)] border border-[var(--border)] relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Background ambient glow */}
      <div
        className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: tier.color }}
      />

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* ── Radial SVG Progress Gauge */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--surface-3)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={tier.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: `drop-shadow(0 0 8px ${tier.color})`,
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-[var(--text-primary)]">
              {score}%
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-[var(--text-muted)] mt-0.5">
              Readiness
            </span>
          </div>
        </div>

        {/* ── Text Insights & Action Stats */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                style={{
                  background: tier.glow,
                  color: tier.color,
                  borderColor: `${tier.color}40`,
                }}
              >
                <Award size={14} />
                <span>Status: {tier.label}</span>
              </div>

              {primaryRoleTitle && (
                <button
                  type="button"
                  onClick={onNavigateToCareer}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--surface-3)] text-[var(--accent-light)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors cursor-pointer"
                >
                  <Compass size={13} />
                  <span>Target: {primaryRoleTitle}</span>
                </button>
              )}
            </div>

            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Overall Learning Readiness
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-md">
              Evidence-based aggregate computed across all 8 skill categories, weighting concept comprehension, practice mastery, volume, and time decay.
            </p>
          </div>

          {/* Key Metric Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <BookOpen size={14} className="text-[var(--accent-light)]" />
              <span>
                <strong className="text-[var(--text-primary)] font-mono">{metrics.activeSubtopicsCount}</strong> Active Subtopics
              </span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Target size={14} className="text-[var(--success)]" />
              <span>
                <strong className="text-[var(--text-primary)] font-mono">{metrics.totalProblems}</strong> Problems Solved
              </span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Clock size={14} className="text-[var(--info)]" />
              <span>
                <strong className="text-[var(--text-primary)] font-mono">{metrics.totalStudyHours}</strong> Study Hours
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
            <button
              onClick={onOpenQuickLog}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-md)] text-xs font-semibold bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent-glow)] hover:bg-[var(--accent-light)] transition-all cursor-pointer"
            >
              <Zap size={14} />
              <span>Quick Log Practice</span>
            </button>
            <button
              onClick={onNavigateToSkills}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-md)] text-xs font-medium bg-[var(--surface-3)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] border border-[var(--border)] transition-all cursor-pointer"
            >
              <span>Explore Skill Tree &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
