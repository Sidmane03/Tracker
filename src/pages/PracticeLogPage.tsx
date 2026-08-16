import React from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { BookOpen } from 'lucide-react'

export const PracticeLogPage: React.FC = () => (
  <PageWrapper title="Log Practice" subtitle="Record your study sessions">
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      style={{ color: 'var(--text-muted)' }}
    >
      <BookOpen size={40} strokeWidth={1} className="mb-4 opacity-40" />
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
        Practice Log coming in Phase 2
      </p>
      <p className="text-xs">Quick-log sessions with difficulty, outcome &amp; accuracy</p>
    </div>
  </PageWrapper>
)
