import React, { useState } from 'react'
import { Archive, AlertCircle, Plus } from 'lucide-react'
import { StarRating } from '@/components/ui/StarRating'
import { CONFIDENCE_LABELS } from '@/types/domain'
import type { Subtopic, ConceptConfidence } from '@/types/domain'
import { useStore } from '@/store'
import { evaluateSubtopicStatus } from '@/lib/engine'

interface SubtopicCardProps {
  subtopic: Subtopic
  onConfidenceChange: (id: string, v: ConceptConfidence) => void
  onArchive: (id: string) => void
  onQuickLog?: (subtopicId: string) => void
}

export const SubtopicCard: React.FC<SubtopicCardProps> = ({
  subtopic,
  onConfidenceChange,
  onArchive,
  onQuickLog,
}) => {
  const [hovered, setHovered] = useState(false)
  const getSubtopicReadiness = useStore((s) => s.getSubtopicReadiness)
  const scores = getSubtopicReadiness(subtopic.id)

  const status = evaluateSubtopicStatus(
    scores.totalReadiness,
    scores.retentionScore,
    scores.conceptScore,
    scores.masteryScore
  )

  const readinessColor =
    scores.totalReadiness >= 80
      ? 'var(--success)'
      : scores.totalReadiness >= 50
      ? 'var(--accent)'
      : scores.totalReadiness >= 25
      ? 'var(--warning)'
      : 'var(--text-muted)'

  return (
    <div
      className="group flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] cursor-default"
      style={{
        background: hovered ? 'var(--surface-3)' : 'var(--surface-2)',
        border: `1px solid ${hovered ? 'var(--border-strong)' : 'var(--border)'}`,
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Status or Revision indicator */}
      {status === 'Revision Due' ? (
        <span title="Revision Due — Retention score has decayed!" className="flex-shrink-0">
          <AlertCircle size={14} className="text-[var(--warning)] animate-pulse" />
        </span>
      ) : (
        <div
          className="flex-shrink-0 rounded-full"
          style={{ width: 6, height: 6, background: readinessColor }}
          title={`Readiness: ${scores.totalReadiness}% (${status})`}
        />
      )}

      {/* Title */}
      <span
        className="flex-1 text-xs font-medium truncate"
        style={{ color: 'var(--text-primary)' }}
        title={`${subtopic.title} • Concept: ${scores.conceptScore}%, Mastery: ${scores.masteryScore}%, Retention: ${scores.retentionScore}%, Volume: ${scores.volumeScore}%`}
      >
        {subtopic.title}
      </span>

      {/* Quick Log button on hover */}
      {onQuickLog && (
        <button
          onClick={() => onQuickLog(subtopic.id)}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-light)] hover:bg-[var(--accent)] hover:text-white transition-all cursor-pointer flex-shrink-0"
          title="Quick log practice for this subtopic"
        >
          <Plus size={10} />
          <span>Log</span>
        </button>
      )}

      {/* Mini score pill */}
      <span
        className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded flex-shrink-0"
        style={{
          background: 'var(--surface-1)',
          color: readinessColor,
          border: '1px solid var(--border)',
        }}
        title={`Total Readiness: ${scores.totalReadiness}%\n• Concept: ${scores.conceptScore}%\n• Mastery: ${scores.masteryScore}%\n• Retention: ${scores.retentionScore}%\n• Volume: ${scores.volumeScore}%`}
      >
        {scores.totalReadiness}%
      </span>

      {/* Star rating */}
      <div className="flex-shrink-0" title={`Confidence: ${CONFIDENCE_LABELS[subtopic.conceptConfidence]}`}>
        <StarRating
          value={subtopic.conceptConfidence}
          onChange={(v) => onConfidenceChange(subtopic.id, v)}
          size={12}
        />
      </div>

      {/* Archive button — visible on hover */}
      <button
        onClick={() => onArchive(subtopic.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5"
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
