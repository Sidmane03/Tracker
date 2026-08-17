import React from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui'
import { HeroReadinessGauge } from '@/features/dashboard/components/HeroReadinessGauge'
import { TodaysFocusWidget } from '@/features/dashboard/components/TodaysFocusWidget'
import { CategoryProgressGrid } from '@/features/dashboard/components/CategoryProgressGrid'
import { StrengthWeaknessPanel } from '@/features/dashboard/components/StrengthWeaknessPanel'
import { SkillGapsRadar } from '@/features/dashboard/components/SkillGapsRadar'
import { RecentActivityFeed } from '@/features/dashboard/components/RecentActivityFeed'
import { useStore } from '@/store'
import { getDashboardSummaryMetrics } from '@/lib/engine'
import { useDashboardScores } from '@/hooks/useDashboardScores'
import { Plus } from 'lucide-react'

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

  // Centralized score computation — passed down to child widgets
  const { subtopicList, scores } = useDashboardScores()

  const metrics = getDashboardSummaryMetrics(store, scores)
  const primaryRole = store.careerRoles.find((r) => r.id === store.preferences.primaryCareerTarget)

  return (
    <PageWrapper
      title="Dashboard"
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
      <div className="space-y-10 max-w-6xl pb-8">
        {/* ── Top Hero: Radial Readiness Gauge & Core Metrics */}
        <section>
          <HeroReadinessGauge
            overallReadiness={overallReadiness}
            metrics={metrics}
            primaryRoleTitle={primaryRole?.title}
            onNavigateToSkills={() => onNavigate?.('skills')}
            onNavigateToCareer={() => onNavigate?.('career')}
            onOpenQuickLog={() => onOpenQuickLog?.()}
          />
        </section>

        {/* ── Today's Recommended Focus */}
        <section>
          <TodaysFocusWidget
            subtopicList={subtopicList}
            scores={scores}
            onOpenQuickLog={(sid) => onOpenQuickLog?.(sid)}
            onInspectSubtopic={(sid) => onInspectSubtopic?.(sid)}
          />
        </section>

        {/* ── Category Progress Bars */}
        <section>
          <CategoryProgressGrid
            onNavigateToSkills={() => onNavigate?.('skills')}
          />
        </section>

        {/* ── 2-Column Analytics: Strengths / Weaknesses & Skill Gaps vs Activity Feed */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Strengths, Weaknesses, and Skill Gaps */}
            <div className="lg:col-span-2 space-y-6">
              <StrengthWeaknessPanel
                subtopicList={subtopicList}
                scores={scores}
                onOpenQuickLog={(sid) => onOpenQuickLog?.(sid)}
                onInspectSubtopic={(sid) => onInspectSubtopic?.(sid)}
              />
              <SkillGapsRadar
                subtopicList={subtopicList}
                scores={scores}
                onOpenQuickLog={(sid) => onOpenQuickLog?.(sid)}
                onInspectSubtopic={(sid) => onInspectSubtopic?.(sid)}
              />
            </div>

            {/* Right 1 Col: Recent Practice Activity */}
            <div className="lg:col-span-1">
              <RecentActivityFeed
                onNavigateToLogs={() => onNavigate?.('log')}
              />
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
