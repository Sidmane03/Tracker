import React, { useState } from 'react'
import {
  ChevronDown,
  Code2, GitBranch, Database, BarChart2, TrendingUp,
  Brain, Cpu, Puzzle,
} from 'lucide-react'
import type { Category } from '@/types/domain'
import { TopicSection } from './TopicSection'
import { useSkillTree } from '../hooks/useSkillTree'

// ── Icon lookup by Lucide name string ───────────────────────────────────────
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

// ── Color → CSS var mapping ──────────────────────────────────────────────────
function catColor(colorToken: string): string {
  return `var(--${colorToken})`
}

interface CategoryCardProps {
  category: Category
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const [expanded, setExpanded] = useState(false)
  const { topics, subtopics, setSubtopicConfidence, addCustomSubtopic, archiveSubtopic } =
    useSkillTree()

  const activeTopics = category.topicIds.filter((id) => topics[id] && !topics[id].isArchived)

  // Total subtopics + mastered count for the category summary
  const allSubtopicIds = activeTopics.flatMap((tid) => topics[tid]?.subtopicIds ?? [])
  const allSubs = allSubtopicIds.map((sid) => subtopics[sid]).filter((s) => s && !s.isArchived)
  const mastered = allSubs.filter((s) => s.conceptConfidence >= 4).length
  const total = allSubs.length
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0

  const color = catColor(category.color)
  const icon = ICON_MAP[category.icon] ?? <Code2 size={16} />

  return (
    <div
      className="rounded-[var(--radius-lg)] overflow-hidden"
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${color}`,
        transition: 'border-color 0.15s',
      }}
    >
      {/* ── Category header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left"
        style={{ background: 'transparent' }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.background = 'var(--surface-2)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.background = 'transparent')
        }
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-[var(--radius-sm)] flex-shrink-0"
          style={{
            width: 32,
            height: 32,
            background: `${color}15`,
            color,
          }}
        >
          {icon}
        </div>

        {/* Title + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {category.title}
            </span>
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              {activeTopics.length} topics · {total} subtopics
            </span>
          </div>
          {/* Mini progress bar */}
          {total > 0 && (
            <div className="flex items-center gap-2 mt-1.5">
              <div
                className="flex-1 rounded-full overflow-hidden"
                style={{ height: 3, background: 'var(--surface-3)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: pct >= 70 ? 'var(--success)' : pct >= 40 ? color : 'var(--warning)',
                  }}
                />
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)', minWidth: 32 }}>
                {mastered}/{total}
              </span>
            </div>
          )}
        </div>

        {/* Expand chevron */}
        <ChevronDown
          size={16}
          style={{
            color: 'var(--text-muted)',
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* ── Topics list */}
      {expanded && (
        <div
          className="px-4 pb-4 space-y-1"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div className="pt-3 space-y-1">
            {activeTopics.map((topicId) => (
              <TopicSection
                key={topicId}
                topic={topics[topicId]}
                subtopics={subtopics}
                onConfidenceChange={setSubtopicConfidence}
                onArchive={archiveSubtopic}
                onAddSubtopic={addCustomSubtopic}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
