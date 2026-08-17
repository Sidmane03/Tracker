import React from 'react'
import {
  Code2, GitBranch, Database, BarChart2, TrendingUp,
  Brain, Cpu, Puzzle
} from 'lucide-react'
import { ProgressBar } from '@/components/ui'
import { useStore } from '@/store'

const ICON_MAP: Record<string, React.ReactNode> = {
  Code2:      <Code2 size={14} />,
  GitBranch:  <GitBranch size={14} />,
  Database:   <Database size={14} />,
  BarChart2:  <BarChart2 size={14} />,
  TrendingUp: <TrendingUp size={14} />,
  Brain:      <Brain size={14} />,
  Cpu:        <Cpu size={14} />,
  Puzzle:     <Puzzle size={14} />,
}

interface CategoryProgressGridProps {
  onNavigateToSkills?: (categoryId?: string) => void
}

export const CategoryProgressGrid: React.FC<CategoryProgressGridProps> = ({
  onNavigateToSkills,
}) => {
  const { categories, categoryOrder, getCategoryReadiness, topics } = useStore()

  return (
    <section>
      {/* ── Section Header matching Figma */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--text-muted)] uppercase">
            Learning map
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Category progress
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onNavigateToSkills?.()}
          className="text-xs font-bold text-[#aab0ff] hover:text-white transition cursor-pointer flex items-center gap-1"
        >
          <span>All skills →</span>
        </button>
      </div>

      {/* ── Grid matching Figma Learning map */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categoryOrder.map((cid) => {
          const cat = categories[cid]
          if (!cat) return null

          const score = getCategoryReadiness(cid)
          const color = `var(--${cat.color})`
          const icon = ICON_MAP[cat.icon] ?? <Code2 size={14} />
          const topicCount = cat.topicIds?.filter((tid) => topics[tid] && !topics[tid].isArchived).length ?? 0

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
              className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#10192b] p-4 text-left transition hover:-translate-y-0.5 hover:border-white/[0.17] hover:bg-[#142038] cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: color }}
                    />
                    <span className="truncate text-sm font-semibold text-[#e8edfb] group-hover:text-[var(--accent-light)] transition-colors">
                      {cat.title}
                    </span>
                  </div>
                  <span className="mono text-base font-semibold text-white">
                    {score}%
                  </span>
                </div>

                <ProgressBar value={score} color={color} />
              </div>

              <div className="mt-3.5 flex items-center justify-between text-[11px] text-[#8290aa] pt-2 border-t border-white/[0.04]">
                <span className="flex items-center gap-1.5">
                  <span className="opacity-70">{icon}</span>
                  <span>{topicCount} topics</span>
                </span>
                <span className="font-semibold text-[#bdc6df] group-hover:text-white transition-colors">
                  Open →
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
