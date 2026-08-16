import React, { useState } from 'react'
import { ChevronRight, Plus, Check, X } from 'lucide-react'
import type { Topic, ConceptConfidence } from '@/types/domain'
import { SubtopicCard } from './SubtopicCard'

interface TopicSectionProps {
  topic: Topic
  subtopics: Record<string, import('@/types/domain').Subtopic>
  onConfidenceChange: (id: string, v: ConceptConfidence) => void
  onArchive: (id: string) => void
  onAddSubtopic: (topicId: string, title: string) => void
}

export const TopicSection: React.FC<TopicSectionProps> = ({
  topic,
  subtopics,
  onConfidenceChange,
  onArchive,
  onAddSubtopic,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const activeSubtopics = topic.subtopicIds
    .map((id) => subtopics[id])
    .filter((s) => s && !s.isArchived)

  const handleAdd = () => {
    const trimmed = newTitle.trim()
    if (trimmed.length > 0) {
      onAddSubtopic(topic.id, trimmed)
      setNewTitle('')
      setAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') { setAdding(false); setNewTitle('') }
  }

  return (
    <div>
      {/* ── Topic header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] text-left group"
        style={{ background: 'transparent', color: 'var(--text-secondary)' }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
        }}
      >
        <ChevronRight
          size={13}
          style={{
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.18s ease',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
        />
        <span className="text-xs font-medium flex-1 truncate">{topic.title}</span>
        <span
          className="text-xs flex-shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          {activeSubtopics.length}
        </span>
      </button>

      {/* ── Subtopics */}
      {expanded && (
        <div className="ml-4 mt-1 space-y-1">
          {activeSubtopics.map((sub) => (
            <SubtopicCard
              key={sub.id}
              subtopic={sub}
              onConfidenceChange={onConfidenceChange}
              onArchive={onArchive}
            />
          ))}

          {/* ── Add subtopic inline */}
          {adding ? (
            <div
              className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)]"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-strong)',
              }}
            >
              <input
                autoFocus
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Subtopic title..."
                className="flex-1 text-xs bg-transparent"
                style={{ color: 'var(--text-primary)', outline: 'none' }}
                maxLength={60}
              />
              <button
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                style={{ color: 'var(--success)' }}
                title="Add"
              >
                <Check size={13} />
              </button>
              <button
                onClick={() => { setAdding(false); setNewTitle('') }}
                style={{ color: 'var(--text-muted)' }}
                title="Cancel"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-[var(--radius-sm)] w-full"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = 'var(--accent-light)'
                ;(e.currentTarget as HTMLElement).style.background = 'var(--accent-subtle)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
                ;(e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              <Plus size={11} />
              Add subtopic
            </button>
          )}
        </div>
      )}
    </div>
  )
}
