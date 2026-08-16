import React from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { HeroReadinessGauge } from '@/features/dashboard/components/HeroReadinessGauge'
import { TodaysFocusWidget } from '@/features/dashboard/components/TodaysFocusWidget'
import { CategoryProgressGrid } from '@/features/dashboard/components/CategoryProgressGrid'
import { StrengthWeaknessPanel } from '@/features/dashboard/components/StrengthWeaknessPanel'
import { SkillGapsRadar } from '@/features/dashboard/components/SkillGapsRadar'
import { RecentActivityFeed } from '@/features/dashboard/components/RecentActivityFeed'
import { useStore } from '@/store'
import { getDashboardSummaryMetrics } from '@/lib/engine'
import { Plus } from 'lucide-react'
import type { ScoreBreakdown } from '@/lib/engine'

interface DashboardPageProps {
  onNavigate?: (page: string, filter?: string) => void
  onOpenQuickLog?: (subtopicId?: string) => void
  onInspectSubtopic?: (subtopicId: string) => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenQuickLog,
  onInspectSubtopic,
}) => {
  const store = useStore()
  const overallReadiness = store.getOverallReadiness()

  const subtopicList = Object.values(store.subtopics)
  const scores: Record<string, ScoreBreakdown> = {}
  for (const s of subtopicList) {
    scores[s.id] = store.getSubtopicReadiness(s.id)
  }

  const metrics = getDashboardSummaryMetrics(store, scores)
  const primaryRole = store.careerRoles.find((r) => r.id === store.preferences.primaryCareerTarget)

  return (
    <PageWrapper
      title="Executive Dashboard"
      subtitle="Real-time learning readiness, category progress, and skill gap intelligence"
      actions={
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => onOpenQuickLog?.()}
        >
          Quick Log
        </Button>
      }
    >
      <div className="space-y-6 max-w-6xl">
        {/* ── Top Hero: Radial Readiness Gauge & Core Metrics */}
        <HeroReadinessGauge
          overallReadiness={overallReadiness}
          metrics={metrics}
          primaryRoleTitle={primaryRole?.title}
          onNavigateToSkills={() => onNavigate?.('skills')}
          onNavigateToCareer={() => onNavigate?.('career')}
          onOpenQuickLog={() => onOpenQuickLog?.()}
        />

        {/* ── Today's Recommended Focus */}
        <TodaysFocusWidget
          onOpenQuickLog={(sid) => onOpenQuickLog?.(sid)}
          onInspectSubtopic={(sid) => onInspectSubtopic?.(sid)}
        />

        {/* ── Category Progress Bars */}
        <CategoryProgressGrid
          onNavigateToSkills={() => onNavigate?.('skills')}
        />

        {/* ── 2-Column Analytics: Strengths / Weaknesses & Skill Gaps vs Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Strengths, Weaknesses, and Skill Gaps */}
          <div className="lg:col-span-2 space-y-6">
            <StrengthWeaknessPanel
              onOpenQuickLog={(sid) => onOpenQuickLog?.(sid)}
            />
            <SkillGapsRadar
              onOpenQuickLog={(sid) => onOpenQuickLog?.(sid)}
            />
          </div>

          {/* Right 1 Col: Recent Practice Activity */}
          <div className="lg:col-span-1">
            <RecentActivityFeed
              onNavigateToLogs={() => onNavigate?.('log')}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
