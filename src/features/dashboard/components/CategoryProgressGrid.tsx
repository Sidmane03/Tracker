import React from 'react'
import {
  Code2, GitBranch, Database, BarChart2, TrendingUp,
  Brain, Cpu, Puzzle, ChevronRight
} from 'lucide-react'
import { Card } from '@/components/ui'
import { useStore } from '@/store'


const ICON_MAP: Record<string, React.ReactNode> = {
  Code2:      <Code2 size={15} />,
  GitBranch:  <GitBranch size={15} />,
  Database:   <Database size={15} />,
  BarChart2:  <BarChart2 size={15} />,
  TrendingUp: <TrendingUp size={15} />,
  Brain:      <Brain size={15} />,
  Cpu:        <Cpu size={15} />,
  Puzzle:     <Puzzle size={15} />,
}

interface CategoryProgressGridProps {
  onNavigateToSkills?: (categoryId?: string) => void
}

export const CategoryProgressGrid: React.FC<CategoryProgressGridProps> = ({
  onNavigateToSkills,
}) => {
  const { categories, categoryOrder, getCategoryReadiness, topics } = useStore()

  return (
    <Card className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
          Category Progress Breakdown
        </h3>
        <button
          onClick={() => onNavigateToSkills?.()}
          className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-light)] flex items-center gap-1 cursor-pointer font-medium transition-colors"
        >
          <span>All Topics</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* ── Spacious 4x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryOrder.map((cid) => {
          const cat = categories[cid]
          if (!cat) return null

          const score = getCategoryReadiness(cid)
          const color = `var(--${cat.color})`
          const icon = ICON_MAP[cat.icon] ?? <Code2 size={15} />
          const topicCount = cat.topicIds?.filter((tid) => topics[tid] && !topics[tid].isArchived).length ?? 0

          return (
            <div
              key={cid}
              onClick={() => onNavigateToSkills?.(cid)}
              className="p-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, color }}
                  >
                    {icon}
                  </div>
                  <span
                    className="text-xs font-mono font-medium text-[var(--text-primary)]"
                  >
                    {score}%
                  </span>
                </div>

                <h4 className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-light)] transition-colors truncate">
                  {cat.title}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {topicCount} topics
                </p>
              </div>

              {/* Clean Horizontal Progress Bar */}
              <div className="mt-4 pt-1">
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 3, background: 'var(--surface-3)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${score}%`,
                      background: score >= 75 ? 'var(--success)' : score >= 40 ? color : 'var(--warning)',
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
