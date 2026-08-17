import React from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
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

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getFormattedDate(): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date())
  } catch {
    return 'Today'
  }
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenQuickLog,
  onInspectSubtopic,
}) => {
  const store = useStore()
  const overallReadiness = store.getOverallReadiness()

  // Centralized subtopic readiness scores computation
  const { subtopicList, scores } = useDashboardScores()

  const metrics = getDashboardSummaryMetrics(store, scores)
  const primaryRole = store.careerRoles.find((r) => r.id === store.preferences.primaryCareerTarget)

  const greeting = getGreeting()
  const formattedDate = getFormattedDate()

  return (
    <PageWrapper
      title="Dashboard"
      actions={
        <button
          type="button"
          onClick={() => onOpenQuickLog?.()}
          className="flex items-center gap-2 rounded-xl bg-[#7c83ff] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_6px_20px_rgba(124,131,255,.28)] transition hover:-translate-y-0.5 hover:bg-[#8d93ff] cursor-pointer"
        >
          <Plus size={16} />
          <span>Quick log</span>
        </button>
      }
    >
      <div className="space-y-8 max-w-6xl pb-10">
        {/* ── Page Hero Greeting matching Figma */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium tracking-[0.12em] text-[#8491ab] uppercase">
              {formattedDate}
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.045em] text-white sm:text-[28px]">
              {greeting}, Learner
            </h1>
          </div>
        </div>

        {/* ── Section 1: Skill Progress Overview (Figma "Skill progress") */}
        <section>
          <HeroReadinessGauge
            overallReadiness={overallReadiness}
            metrics={metrics}
            primaryRoleTitle={primaryRole?.title}
            onNavigateToSkills={(cid) => onNavigate?.('skills', cid)}
            onNavigateToCareer={() => onNavigate?.('career')}
            onOpenQuickLog={() => onOpenQuickLog?.()}
          />
        </section>

        {/* ── Section 2: Today's Recommended Focus (Figma "Today's focus") */}
        <section>
          <TodaysFocusWidget
            subtopicList={subtopicList}
            scores={scores}
            onOpenQuickLog={(sid) => onOpenQuickLog?.(sid)}
            onInspectSubtopic={(sid) => onInspectSubtopic?.(sid)}
          />
        </section>

        {/* ── Section 3: Category Progress (Figma "Category progress") */}
        <section>
          <CategoryProgressGrid
            onNavigateToSkills={(cid) => onNavigate?.('skills', cid)}
          />
        </section>

        {/* ── Section 4: 2-Column Analytics (Figma "Pattern check" vs "Act next") */}
        <section className="grid gap-4 xl:grid-cols-[1.12fr_.88fr]">
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
            onNavigateToSkills={() => onNavigate?.('skills')}
          />
        </section>

        {/* ── Section 5: Recent Practice Activity (Figma "Recent practice") */}
        <section>
          <RecentActivityFeed
            onNavigateToLogs={() => onNavigate?.('log')}
          />
        </section>
      </div>
    </PageWrapper>
  )
}
