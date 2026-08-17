import React from 'react'
import { ProgressBar } from '@/components/ui'
import { useStore } from '@/store'

interface HeroReadinessGaugeProps {
  overallReadiness?: number
  onNavigateToSkills?: (categoryId?: string) => void
  onNavigateToCareer?: () => void
  onOpenQuickLog?: () => void
}

export const HeroReadinessGauge: React.FC<HeroReadinessGaugeProps> = ({
  onNavigateToSkills,
}) => {
  const { categories, categoryOrder, getCategoryReadiness } = useStore()

  return (
    <div className="rounded-[20px] border border-white/[0.08] bg-[#10192b] p-5 sm:p-6">
      {/* ── Header matching Figma Image 1 */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#8c98b1] uppercase">
            Your learning
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
            Skill progress
          </h2>
        </div>
        <span className="text-xs text-[#8290aa]">
          Ready to practice
        </span>
      </div>

      {/* ── 2-Column Grid of 8 Skills matching Figma Image 1 */}
      <div className="mt-5 grid gap-x-7 gap-y-3.5 sm:grid-cols-2">
        {categoryOrder.map((cid) => {
          const cat = categories[cid]
          if (!cat) return null
          const score = getCategoryReadiness(cid)
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
              className="cursor-pointer group"
            >
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#dce3f5] group-hover:text-white transition-colors">
                  {cat.title}
                </span>
                <span className="mono text-xs font-semibold text-[#b9c4dd]">
                  {score}%
                </span>
              </div>
              <ProgressBar value={score} color={color} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
