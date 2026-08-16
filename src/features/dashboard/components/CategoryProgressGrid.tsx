import React from 'react'
import {
  Code2, GitBranch, Database, BarChart2, TrendingUp,
  Brain, Cpu, Puzzle, ChevronRight
} from 'lucide-react'
import { useStore } from '@/store'

const ICON_MAP: Record<string, React.ReactNode> = {
  Code2:      <Code2 size={16} />,
  GitBranch:  <GitBranch size={16} />,
  Database:   <Database size={16} />,
  BarChart2:  <BarChart2 size={16} />,
  TrendingUp: <TrendingUp size={16} />,
  Brain:      <Brain size={16} />,
  Cpu:        <Cpu size={16} />,
  Puzzle:     <Puzzle size={16} />,
}

interface CategoryProgressGridProps {
  onNavigateToSkills?: (categoryId?: string) => void
}

export const CategoryProgressGrid: React.FC<CategoryProgressGridProps> = ({
  onNavigateToSkills,
}) => {
  const { categories, categoryOrder, getCategoryReadiness, topics } = useStore()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Category Progress Breakdown
        </h3>
        <button
          onClick={() => onNavigateToSkills?.()}
          className="text-xs text-[var(--accent-light)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View all topics</span>
          <ChevronRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {categoryOrder.map((cid) => {
          const cat = categories[cid]
          if (!cat) return null

          const score = getCategoryReadiness(cid)
          const color = `var(--${cat.color})`
          const icon = ICON_MAP[cat.icon] ?? <Code2 size={16} />
          const topicCount = cat.topicIds.filter((tid) => topics[tid] && !topics[tid].isArchived).length

          return (
            <div
              key={cid}
              onClick={() => onNavigateToSkills?.(cid)}
              className="p-4 rounded-[var(--radius-lg)] border border-[var(--border)] transition-all hover:border-[var(--border-strong)] hover:translate-y-[-2px] cursor-pointer group flex flex-col justify-between"
              style={{
                background: 'var(--surface-1)',
                borderLeft: `3px solid ${color}`,
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, color }}
                  >
                    {icon}
                  </div>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{
                      color: score >= 75 ? 'var(--success)' : score >= 45 ? color : 'var(--text-secondary)',
                    }}
                  >
                    {score}%
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-light)] transition-colors truncate">
                  {cat.title}
                </h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {topicCount} active topics
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 4, background: 'var(--surface-3)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${score}%`,
                      background: score >= 75 ? 'var(--success)' : score >= 45 ? color : 'var(--warning)',
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
