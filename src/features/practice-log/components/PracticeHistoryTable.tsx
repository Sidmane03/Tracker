import React, { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { Search, Trash2, ExternalLink, Calendar, Filter, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDistanceToNow, format } from 'date-fns'

interface PracticeHistoryTableProps {
  onOpenQuickLog?: () => void
}

export const PracticeHistoryTable: React.FC<PracticeHistoryTableProps> = ({
  onOpenQuickLog,
}) => {
  const { practiceLogs, categories, topics, subtopics, deletePracticeLog } = useStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL')
  const [filterOutcome, setFilterOutcome] = useState<string>('ALL')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredLogs = useMemo(() => {
    return practiceLogs.filter((log) => {
      const sub = subtopics[log.subtopicId]
      const top = topics[log.topicId]
      const cat = categories[log.categoryId]

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = sub?.title.toLowerCase().includes(q)
        const matchTopic = top?.title.toLowerCase().includes(q)
        const matchCat = cat?.title.toLowerCase().includes(q)
        const matchNotes = log.notes?.toLowerCase().includes(q)
        if (!matchTitle && !matchTopic && !matchCat && !matchNotes) return false
      }

      // Difficulty match
      if (filterDifficulty !== 'ALL' && log.difficulty !== filterDifficulty) return false

      // Outcome match
      if (filterOutcome !== 'ALL' && log.outcome !== filterOutcome) return false

      return true
    })
  }, [practiceLogs, subtopics, topics, categories, searchQuery, filterDifficulty, filterOutcome])

  const handleDelete = (id: string) => {
    deletePracticeLog(id)
    setDeletingId(null)
  }

  if (practiceLogs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center p-12 text-center rounded-[var(--radius-lg)] border border-[var(--border)]"
        style={{ background: 'var(--surface-1)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
        >
          <BookOpen size={24} />
        </div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
          No practice sessions logged yet
        </h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-4">
          Start recording your problems, study time, and outcomes to power your evidence-based readiness scores.
        </p>
        <Button variant="primary" size="sm" onClick={onOpenQuickLog}>
          Log Your First Problem
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* ── Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            placeholder="Search logs by topic, category, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-1)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--accent)]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Filter size={12} />
            <span>Difficulty:</span>
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-1)] text-[var(--text-primary)] border border-[var(--border)]"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={filterOutcome}
            onChange={(e) => setFilterOutcome(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-1)] text-[var(--text-primary)] border border-[var(--border)]"
          >
            <option value="ALL">All Outcomes</option>
            <option value="Solved">Solved</option>
            <option value="Struggled">Struggled</option>
            <option value="Needed Help">Needed Help</option>
          </select>
        </div>
      </div>

      {/* ── Table */}
      <div
        className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]"
        style={{ background: 'var(--surface-1)' }}
      >
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr
              className="border-b border-[var(--border)] text-[var(--text-muted)] font-medium"
              style={{ background: 'var(--surface-2)' }}
            >
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Topic / Subtopic</th>
              <th className="py-2.5 px-3">Difficulty</th>
              <th className="py-2.5 px-3">Outcome</th>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Accuracy</th>
              <th className="py-2.5 px-3">Notes &amp; Links</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[var(--text-muted)]">
                  No practice entries match the selected filters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const sub = subtopics[log.subtopicId]
                const cat = categories[log.categoryId]

                const diffVariant =
                  log.difficulty === 'Easy'
                    ? 'success'
                    : log.difficulty === 'Medium'
                    ? 'warning'
                    : 'danger'

                const outVariant =
                  log.outcome === 'Solved'
                    ? 'success'
                    : log.outcome === 'Struggled'
                    ? 'warning'
                    : 'accent'

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-[var(--surface-2)] transition-colors group"
                  >
                    {/* Date */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-[var(--text-muted)]">
                      <div className="flex items-center gap-1.5" title={format(log.timestamp, 'PPpp')}>
                        <Calendar size={12} />
                        <span>{formatDistanceToNow(log.timestamp, { addSuffix: true })}</span>
                      </div>
                    </td>

                    {/* Subtopic & Category */}
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-[var(--text-primary)]">
                        {sub?.title || log.subtopicId}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {cat?.title || log.categoryId}
                      </div>
                    </td>

                    {/* Difficulty */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <Badge variant={diffVariant}>{log.difficulty}</Badge>
                    </td>

                    {/* Outcome */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <Badge variant={outVariant}>{log.outcome}</Badge>
                    </td>

                    {/* Time */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-[var(--text-secondary)] font-mono">
                      {log.timeSpentMinutes}m
                    </td>

                    {/* Accuracy */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {log.accuracyPercent !== undefined ? (
                        <span className="font-mono text-[var(--text-primary)] font-medium">
                          {log.accuracyPercent}%
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)]">—</span>
                      )}
                    </td>

                    {/* Notes & Link */}
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="truncate text-[var(--text-secondary)]" title={log.notes}>
                        {log.notes || '—'}
                      </div>
                      {log.resourceRef && (
                        <a
                          href={log.resourceRef}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-[var(--accent-light)] hover:underline mt-0.5"
                        >
                          <ExternalLink size={10} />
                          Resource link
                        </a>
                      )}
                    </td>

                    {/* Delete Action */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      {deletingId === log.id ? (
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--danger)] text-white hover:bg-[var(--danger)]/80 cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="text-[10px] px-1.5 py-0.5 rounded text-[var(--text-muted)] hover:bg-[var(--surface-3)] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(log.id)}
                          className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--danger)] transition-all p-1 cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
