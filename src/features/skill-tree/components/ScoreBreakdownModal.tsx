import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { StarRating } from '@/components/ui/StarRating'
import { Badge } from '@/components/ui/Badge'
import { useStore } from '@/store'
import {
  evaluateSubtopicStatus,
  SCORE_WEIGHTS,
} from '@/lib/engine'
import {
  Brain,
  Award,
  Clock,
  Layers,
  History,
  Edit3,
  Check,
  Plus,
  ExternalLink,
  Target,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { ConceptConfidence } from '@/types/domain'

interface ScoreBreakdownModalProps {
  isOpen: boolean
  onClose: () => void
  subtopicId?: string
  onOpenQuickLog?: (subtopicId: string) => void
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  isOpen,
  onClose,
  subtopicId,
  onOpenQuickLog,
}) => {
  const {
    subtopics,
    topics,
    categories,
    practiceLogs,
    setSubtopicConfidence,
    updateSubtopicNotes,
    getSubtopicReadiness,
  } = useStore()

  const subtopic = subtopicId ? subtopics[subtopicId] : undefined
  const topic = subtopic ? topics[subtopic.topicId] : undefined
  const category = subtopic ? categories[subtopic.categoryId] : undefined

  const [editingNotes, setEditingNotes] = useState(false)
  const [notesText, setNotesText] = useState(subtopic?.notes || '')

  if (!subtopic || !topic || !category) return null

  const scores = getSubtopicReadiness(subtopic.id)
  const status = evaluateSubtopicStatus(
    scores.totalReadiness,
    scores.retentionScore,
    scores.conceptScore,
    scores.masteryScore
  )

  const subtopicLogs = practiceLogs.filter((l) => l.subtopicId === subtopic.id)

  const handleSaveNotes = () => {
    updateSubtopicNotes(subtopic.id, notesText)
    setEditingNotes(false)
  }

  // Calculated point contributions out of 100 max
  const conceptPoints = Math.round(SCORE_WEIGHTS.concept * scores.conceptScore * 10) / 10
  const masteryPoints = Math.round(SCORE_WEIGHTS.mastery * scores.masteryScore * 10) / 10
  const retentionPoints = Math.round(SCORE_WEIGHTS.retention * scores.retentionScore * 10) / 10
  const volumePoints = Math.round(SCORE_WEIGHTS.volume * scores.volumeScore * 10) / 10

  const statusVariant =
    status === 'Mastered'
      ? 'success'
      : status === 'Revision Due'
      ? 'warning'
      : status === 'In Progress'
      ? 'accent'
      : 'default'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transparent Score Breakdown"
      size="lg"
    >
      <div className="space-y-6">
        {/* ── Subtopic Header & Status */}
        <div
          className="p-4 rounded-[var(--radius-lg)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: 'var(--surface-2)' }}
        >
          <div>
            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 mb-1">
              <span>{category.title}</span>
              <span>&rsaquo;</span>
              <span>{topic.title}</span>
            </div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {subtopic.title}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant={statusVariant} dot>
                {status}
              </Badge>
              <span className="text-[11px] text-[var(--text-muted)]">
                Weight: &times;{subtopic.weight || 1} &bull; Target Quota: {subtopic.targetProblemQuota} problems
              </span>
            </div>
          </div>

          {/* Overall Readiness Badge */}
          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
            <span className="text-2xl font-mono font-extrabold text-[var(--accent-light)]">
              {scores.totalReadiness}%
            </span>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Total Readiness
            </span>
          </div>
        </div>

        {/* ── 4-Factor Mathematical Contribution Cards */}
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
            4-Factor Mathematical Contribution
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Concept Confidence (25%) */}
            <div
              className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border)]"
              style={{ background: 'var(--surface-1)' }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
                  <Brain size={15} className="text-[var(--accent-light)]" />
                  <span>Concept Confidence</span>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--accent-light)]">
                  {conceptPoints} / 25 pts
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-2.5">
                Raw rating: {scores.conceptScore}% &bull; 25% weight
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                <span className="text-[11px] text-[var(--text-secondary)]">Rate Confidence:</span>
                <StarRating
                  value={subtopic.conceptConfidence}
                  onChange={(v: ConceptConfidence) => setSubtopicConfidence(subtopic.id, v)}
                  size={14}
                  showLabel
                />
              </div>
            </div>

            {/* 2. Practice Mastery (40%) */}
            <div
              className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border)]"
              style={{ background: 'var(--surface-1)' }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
                  <Award size={15} className="text-[var(--success)]" />
                  <span>Practice Mastery</span>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--success)]">
                  {masteryPoints} / 40 pts
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-2.5">
                Outcome &amp; difficulty weighted mastery &bull; 40% weight
              </p>
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                <span>Calculated Mastery:</span>
                <span className="font-mono font-bold text-[var(--text-primary)]">{scores.masteryScore}%</span>
              </div>
            </div>

            {/* 3. Retention / Recency (20%) */}
            <div
              className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border)]"
              style={{ background: 'var(--surface-1)' }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
                  <Clock size={15} className="text-[var(--warning)]" />
                  <span>Retention / Recency</span>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--warning)]">
                  {retentionPoints} / 20 pts
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-2.5">
                Exponential half-life curve (21-day decay) &bull; 20% weight
              </p>
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                <span>Last Practiced:</span>
                <span className="text-[var(--text-primary)]">
                  {subtopic.lastPracticedAt
                    ? formatDistanceToNow(subtopic.lastPracticedAt, { addSuffix: true })
                    : 'Never'}
                </span>
              </div>
            </div>

            {/* 4. Practice Volume (15%) */}
            <div
              className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border)]"
              style={{ background: 'var(--surface-1)' }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
                  <Layers size={15} className="text-[var(--info)]" />
                  <span>Practice Volume</span>
                </div>
                <span className="text-xs font-mono font-bold text-[var(--info)]">
                  {volumePoints} / 15 pts
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mb-2.5">
                Progress towards recommended quota &bull; 15% weight
              </p>
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                <span>Quota Progress:</span>
                <span className="font-mono text-[var(--text-primary)]">
                  {subtopicLogs.length} / {subtopic.targetProblemQuota} ({scores.volumeScore}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Subtopic Notes */}
        <div
          className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border)]"
          style={{ background: 'var(--surface-1)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
              <Edit3 size={14} className="text-[var(--accent-light)]" />
              <span>Personal Notes &amp; Key Takeaways</span>
            </div>
            {!editingNotes ? (
              <button
                onClick={() => {
                  setNotesText(subtopic.notes || '')
                  setEditingNotes(true)
                }}
                className="text-[11px] text-[var(--accent-light)] hover:underline cursor-pointer"
              >
                {subtopic.notes ? 'Edit Notes' : '+ Add Note'}
              </button>
            ) : (
              <button
                onClick={handleSaveNotes}
                className="text-[11px] text-[var(--success)] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Check size={12} />
                Save Notes
              </button>
            )}
          </div>

          {editingNotes ? (
            <textarea
              rows={3}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Record important edge cases, algorithmic patterns, or formula reminders..."
              className="w-full text-xs p-2.5 rounded bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border-strong)] focus:border-[var(--accent)] resize-none"
            />
          ) : (
            <p className="text-xs text-[var(--text-secondary)] italic">
              {subtopic.notes || 'No notes added yet for this subtopic.'}
            </p>
          )}
        </div>

        {/* ── Subtopic Practice History */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
              <History size={14} />
              <span>Historical Practice Attempts ({subtopicLogs.length})</span>
            </h3>
            {onOpenQuickLog && (
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={13} />}
                onClick={() => {
                  onClose()
                  onOpenQuickLog(subtopic.id)
                }}
              >
                Log Session
              </Button>
            )}
          </div>

          {subtopicLogs.length === 0 ? (
            <div
              className="p-6 text-center rounded-[var(--radius-md)] border border-[var(--border)] text-xs text-[var(--text-muted)]"
              style={{ background: 'var(--surface-1)' }}
            >
              <Target size={24} className="mx-auto mb-2 opacity-40" />
              <p>No practice sessions recorded yet for {subtopic.title}.</p>
            </div>
          ) : (
            <div
              className="max-h-48 overflow-y-auto divide-y divide-[var(--border)] rounded-[var(--radius-md)] border border-[var(--border)]"
              style={{ background: 'var(--surface-1)' }}
            >
              {subtopicLogs.map((log) => {
                const diffVariant =
                  log.difficulty === 'Easy' ? 'success' : log.difficulty === 'Medium' ? 'warning' : 'danger'
                const outVariant =
                  log.outcome === 'Solved' ? 'success' : log.outcome === 'Struggled' ? 'warning' : 'accent'

                return (
                  <div key={log.id} className="p-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={diffVariant}>{log.difficulty}</Badge>
                        <Badge variant={outVariant}>{log.outcome}</Badge>
                        <span className="font-mono text-[var(--text-secondary)]">{log.timeSpentMinutes}m</span>
                        {log.accuracyPercent !== undefined && (
                          <span className="font-mono text-[var(--text-primary)] font-medium">
                            {log.accuracyPercent}% Acc
                          </span>
                        )}
                      </div>
                      {log.notes && (
                        <p className="text-[11px] text-[var(--text-secondary)] mt-1 truncate">
                          {log.notes}
                        </p>
                      )}
                    </div>

                    <div className="text-right text-[10px] text-[var(--text-muted)] flex-shrink-0 flex items-center gap-2">
                      {log.resourceRef && (
                        <a
                          href={log.resourceRef}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent-light)] hover:underline flex items-center gap-0.5"
                        >
                          <ExternalLink size={10} />
                          Link
                        </a>
                      )}
                      <span>{formatDistanceToNow(log.timestamp, { addSuffix: true })}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
