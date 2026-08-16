import React from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { LayoutDashboard } from 'lucide-react'

export const DashboardPage: React.FC = () => (
  <PageWrapper
    title="Dashboard"
    subtitle="Your learning overview at a glance"
  >
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      style={{ color: 'var(--text-muted)' }}
    >
      <LayoutDashboard size={40} strokeWidth={1} className="mb-4 opacity-40" />
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
        Dashboard coming in Phase 4
      </p>
      <p className="text-xs">
        Head to <strong style={{ color: 'var(--accent-light)' }}>Skills</strong> to explore your curriculum
      </p>
    </div>
  </PageWrapper>
)
