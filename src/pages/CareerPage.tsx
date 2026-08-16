import React from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Target } from 'lucide-react'

export const CareerPage: React.FC = () => (
  <PageWrapper title="Career Paths" subtitle="See your readiness for different roles">
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      style={{ color: 'var(--text-muted)' }}
    >
      <Target size={40} strokeWidth={1} className="mb-4 opacity-40" />
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
        Career Matrix coming in Phase 5
      </p>
      <p className="text-xs">Role-weighted readiness scores for DA, DS, ML Engineer &amp; SWE</p>
    </div>
  </PageWrapper>
)
