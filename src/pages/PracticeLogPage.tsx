import React, { useState } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { PracticeHistoryTable } from '@/features/practice-log/components/PracticeHistoryTable'
import { QuickLogModal } from '@/features/practice-log/components/QuickLogModal'
import { useStore } from '@/store'
import { Plus, Clock, Target, CheckCircle, BarChart } from 'lucide-react'

export const PracticeLogPage: React.FC = () => {
  const [quickLogOpen, setQuickLogOpen] = useState(false)
  const { practiceLogs } = useStore()

  // Calculate summary metrics
  const totalProblems = practiceLogs.length
  const totalMinutes = practiceLogs.reduce((acc, l) => acc + (l.timeSpentMinutes || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)

  const solvedCount = practiceLogs.filter((l) => l.outcome === 'Solved').length
  const solveRate = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0

  const accuracySum = practiceLogs
    .filter((l) => l.accuracyPercent !== undefined)
    .reduce((acc, l) => acc + (l.accuracyPercent || 0), 0)
  const accuracyCount = practiceLogs.filter((l) => l.accuracyPercent !== undefined).length
  const avgAccuracy = accuracyCount > 0 ? Math.round(accuracySum / accuracyCount) : null

  return (
    <PageWrapper
      title="Practice Log &amp; History"
      subtitle="Track your daily problem solving sessions, study time, and accuracy"
      actions={
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => setQuickLogOpen(true)}
        >
          Quick Log
        </Button>
      }
    >
      <div className="space-y-6 max-w-5xl">
        {/* ── Summary Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Problems */}
          <div
            className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border)]"
            style={{ background: 'var(--surface-1)' }}
          >
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
              <Target size={14} className="text-[var(--accent-light)]" />
              <span>Problems Solved</span>
            </div>
            <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
              {totalProblems}
            </div>
          </div>

          {/* Time Invested */}
          <div
            className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border)]"
            style={{ background: 'var(--surface-1)' }}
          >
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
              <Clock size={14} className="text-[var(--info)]" />
              <span>Time Invested</span>
            </div>
            <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
              {totalHours} <span className="text-xs font-normal text-[var(--text-muted)]">hrs</span>
            </div>
          </div>

          {/* Solve Rate */}
          <div
            className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border)]"
            style={{ background: 'var(--surface-1)' }}
          >
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
              <CheckCircle size={14} className="text-[var(--success)]" />
              <span>Solved Cleanly</span>
            </div>
            <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
              {solveRate}%
            </div>
          </div>

          {/* Average Accuracy */}
          <div
            className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border)]"
            style={{ background: 'var(--surface-1)' }}
          >
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-1">
              <BarChart size={14} className="text-[var(--warning)]" />
              <span>Avg Accuracy</span>
            </div>
            <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
              {avgAccuracy !== null ? `${avgAccuracy}%` : '—'}
            </div>
          </div>
        </div>

        {/* ── Searchable History Table */}
        <PracticeHistoryTable onOpenQuickLog={() => setQuickLogOpen(true)} />
      </div>

      {/* ── Quick Log Modal */}
      <QuickLogModal
        isOpen={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
      />
    </PageWrapper>
  )
}
