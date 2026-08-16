import React, { useState } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { CareerRoleCard } from '@/features/career/components/CareerRoleCard'
import { RoleDetailInspector } from '@/features/career/components/RoleDetailInspector'
import { useStore } from '@/store'
import { calculateAllRolesReadiness } from '@/lib/engine'
import { Target, Compass } from 'lucide-react'

interface CareerPageProps {
  onNavigateToSkills?: (categoryId?: string) => void
  onOpenQuickLog?: () => void
}

export const CareerPage: React.FC<CareerPageProps> = ({
  onNavigateToSkills,
  onOpenQuickLog,
}) => {
  const { careerRoles, categories, categoryOrder, preferences, setPreferences, getCategoryReadiness } =
    useStore()

  const categoryScores: Record<string, number> = {}
  for (const cid of categoryOrder) {
    categoryScores[cid] = getCategoryReadiness(cid)
  }

  const summaries = calculateAllRolesReadiness(careerRoles, categoryScores, categories)

  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    preferences.primaryCareerTarget || summaries[0]?.role.id || 'backend-swe'
  )

  const selectedSummary =
    summaries.find((s) => s.role.id === selectedRoleId) || summaries[0]

  const handleTogglePrimaryTarget = (roleId: string) => {
    if (preferences.primaryCareerTarget === roleId) {
      setPreferences({ primaryCareerTarget: undefined })
    } else {
      setPreferences({ primaryCareerTarget: roleId })
    }
  }

  return (
    <PageWrapper
      title="Career Paths &amp; Readiness Matrix"
      subtitle="Benchmark your skills against fresher industry roles (Data Analyst, Data Scientist, ML Engineer, AI Engineer, Backend/SWE)"
    >
      <div className="space-y-6 max-w-6xl">
        {/* ── Top Notice / Active Goal Banner */}
        <div
          className="p-4 rounded-[var(--radius-xl)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            background: 'linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent-light)]">
              <Compass size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                Multi-Path Role Competency Models
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Select your primary goal to automatically bias daily focus recommendations toward your chosen career track.
              </p>
            </div>
          </div>

          {preferences.primaryCareerTarget && (
            <div className="px-3 py-1.5 rounded-lg bg-[var(--surface-3)] border border-[var(--border)] flex items-center gap-2 text-xs flex-shrink-0">
              <Target size={14} className="text-[var(--accent-light)]" />
              <span className="text-[var(--text-secondary)]">Target Role:</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {careerRoles.find((r) => r.id === preferences.primaryCareerTarget)?.title}
              </span>
            </div>
          )}
        </div>

        {/* ── 5 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaries.map((sum) => (
            <CareerRoleCard
              key={sum.role.id}
              summary={sum}
              isSelected={sum.role.id === selectedRoleId}
              isPrimaryTarget={preferences.primaryCareerTarget === sum.role.id}
              onSelectRole={setSelectedRoleId}
              onTogglePrimaryTarget={handleTogglePrimaryTarget}
            />
          ))}
        </div>

        {/* ── Detailed Inspector for Selected Role */}
        {selectedSummary && (
          <RoleDetailInspector
            summary={selectedSummary}
            isPrimaryTarget={preferences.primaryCareerTarget === selectedSummary.role.id}
            onTogglePrimaryTarget={handleTogglePrimaryTarget}
            onNavigateToSkills={onNavigateToSkills}
            onOpenQuickLog={onOpenQuickLog}
          />
        )}
      </div>
    </PageWrapper>
  )
}
