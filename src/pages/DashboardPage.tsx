import React from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { HeroReadinessGauge } from '@/features/dashboard/components/HeroReadinessGauge'
import { TodaysFocusWidget } from '@/features/dashboard/components/TodaysFocusWidget'
import { CategoryProgressGrid } from '@/features/dashboard/components/CategoryProgressGrid'
import { StrengthWeaknessPanel } from '@/features/dashboard/components/StrengthWeaknessPanel'
import { SkillGapsRadar } from '@/features/dashboard/components/SkillGapsRadar'
import { RecentActivityFeed } from '@/features/dashboard/components/RecentActivityFeed'
import { useDashboardScores } from '@/hooks/useDashboardScores'

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
    return 'Monday, August 17'
  }
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenQuickLog,
  onInspectSubtopic,
}) => {
  // Centralized subtopic readiness scores computation
  const { subtopicList, scores } = useDashboardScores()

  const greeting = getGreeting()
  const formattedDate = getFormattedDate()

  return (
    <PageWrapper hideHeader={true}>
      <div className="mx-auto max-w-[1500px]">
        {/* ── Page Header matching Figma Image 1 */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium tracking-[0.12em] text-[#8491ab] uppercase">
              {formattedDate}
            </p>
            <h1 className="text-2xl font-semibold tracking-[-0.045em] text-white sm:text-[28px]">
              {greeting}, Harsh
            </h1>
          </div>
          <button
            type="button"
            onClick={() => onOpenQuickLog?.()}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-[#7c83ff] px-4 py-3 text-sm font-bold text-white shadow-[0_9px_20px_rgba(78,88,218,.25)] transition hover:-translate-y-0.5 hover:bg-[#8d93ff] focus:outline-none focus:ring-2 focus:ring-[#aeb2ff] focus:ring-offset-2 focus:ring-offset-[#0a1020] cursor-pointer"
          >
            <span className="text-lg leading-none">+</span> Quick log
          </button>
        </header>

        {/* ── Section 1: Skill progress (Figma Image 1) */}
        <section className="mb-8">
          <HeroReadinessGauge
            onNavigateToSkills={(cid) => onNavigate?.('skills', cid)}
          />
        </section>

        {/* ── Section 2: Today's focus (Figma Image 1) */}
        <TodaysFocusWidget
          subtopicList={subtopicList}
          scores={scores}
          onOpenQuickLog={onOpenQuickLog}
          onInspectSubtopic={onInspectSubtopic}
        />

        {/* ── Section 3: Category progress (Figma Image 2) */}
        <CategoryProgressGrid
          onNavigateToSkills={(cid) => onNavigate?.('skills', cid)}
        />

        {/* ── Section 4: 2-Column Analytics (Figma Image 2 & 3) */}
        <section className="mb-9 grid gap-4 xl:grid-cols-[1.12fr_.88fr]">
          <StrengthWeaknessPanel
            subtopicList={subtopicList}
            scores={scores}
            onOpenQuickLog={onOpenQuickLog}
            onInspectSubtopic={onInspectSubtopic}
          />
          <SkillGapsRadar
            subtopicList={subtopicList}
            scores={scores}
            onOpenQuickLog={onOpenQuickLog}
            onInspectSubtopic={onInspectSubtopic}
            onNavigateToSkills={() => onNavigate?.('skills')}
          />
        </section>

        {/* ── Section 5: Recent practice (Figma Image 3) */}
        <RecentActivityFeed
          onNavigateToLogs={() => onNavigate?.('log')}
        />
      </div>
    </PageWrapper>
  )
}
