import React, { useState } from 'react'
import { Archive } from 'lucide-react'
import { StarRating } from '@/components/ui/StarRating'
import { CONFIDENCE_LABELS } from '@/types/domain'
import type { Subtopic, ConceptConfidence } from '@/types/domain'

interface SubtopicCardProps {
  subtopic: Subtopic
  onConfidenceChange: (id: string, v: ConceptConfidence) => void
  onArchive: (id: string) => void
}

export const SubtopicCard: React.FC<SubtopicCardProps> = ({
  subtopic,
  onConfidenceChange,
  onArchive,
}) => {
  const [hovered, setHovered] = useState(false)

  const confidenceColor =
    subtopic.conceptConfidence >= 4
      ? 'var(--success)'
      : subtopic.conceptConfidence >= 3
      ? 'var(--accent)'
      : subtopic.conceptConfidence >= 2
      ? 'var(--warning)'
      : 'var(--danger)'

  return (
    <div
      className="group flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] cursor-default"
      style={{
        background: hovered ? 'var(--surface-3)' : 'var(--surface-2)',
        border: `1px solid ${hovered ? 'var(--border-strong)' : 'var(--border)'}`,
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Confidence color dot */}
      <div
        className="flex-shrink-0 rounded-full"
        style={{ width: 6, height: 6, background: confidenceColor }}
        title={CONFIDENCE_LABELS[subtopic.conceptConfidence]}
      />

      {/* Title */}
      <span
        className="flex-1 text-xs font-medium truncate"
        style={{ color: 'var(--text-primary)' }}
      >
        {subtopic.title}
      </span>

      {/* Star rating */}
      <div className="flex-shrink-0">
        <StarRating
          value={subtopic.conceptConfidence}
          onChange={(v) => onConfidenceChange(subtopic.id, v)}
          size={12}
        />
      </div>

      {/* Archive button — visible on hover */}
      <button
        onClick={() => onArchive(subtopic.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
        title="Archive subtopic"
        aria-label="Archive subtopic"
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--danger)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
      >
        <Archive size={12} />
      </button>
    </div>
  )
}
