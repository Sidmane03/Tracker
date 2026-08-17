import React from 'react'
import { ProgressBar } from '@/components/ui'
import { useStore } from '@/store'

interface CategoryProgressGridProps {
  onNavigateToSkills?: (categoryId?: string) => void
}

export const CategoryProgressGrid: React.FC<CategoryProgressGridProps> = ({
  onNavigateToSkills,
}) => {
  const { categories, categoryOrder, getCategoryReadiness, subtopics } = useStore()

  const allSubtopics = Object.values(subtopics)

  return (
    <section className="mb-9">
      {/* ── Section Header matching Figma Image 2 */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#8c98b1] uppercase">
            Learning map
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
            Category progress
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onNavigateToSkills?.()}
          className="text-xs font-bold text-[#aab0ff] hover:text-white transition cursor-pointer"
        >
          All skills →
        </button>
      </div>

      {/* ── 3-Column Grid matching Figma Image 2 */}
      <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
        {categoryOrder.map((cid) => {
          const cat = categories[cid]
          if (!cat) return null

          const score = getCategoryReadiness(cid)
          const color = `var(--${cat.color})`
          const subtopicCount = allSubtopics.filter((s) => s.categoryId === cid && !s.isArchived).length

          return (
            <button
              key={cid}
              type="button"
              onClick={() => onNavigateToSkills?.(cid)}
              className="rounded-2xl border border-white/[0.08] bg-[#10192b] p-4 text-left transition hover:-translate-y-0.5 hover:border-white/[0.17] hover:bg-[#142038] w-full block cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  <span className="truncate text-sm font-semibold text-[#e8edfb]">
                    {cat.title}
                  </span>
                </div>
                <span className="mono text-base font-semibold text-white">
                  {score}%
                </span>
              </div>

              <div className="mt-4">
                <ProgressBar value={score} color={color} />
              </div>

              <div className="mt-2.5 flex justify-between text-[11px] text-[#8290aa]">
                <span>{subtopicCount} subtopics</span>
                <span className="font-semibold text-[#bdc6df]">Open →</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
