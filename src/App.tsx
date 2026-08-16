import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardPage } from '@/pages/DashboardPage'
import { SkillsPage } from '@/pages/SkillsPage'
import { PracticeLogPage } from '@/pages/PracticeLogPage'
import { CareerPage } from '@/pages/CareerPage'

type Page = 'dashboard' | 'skills' | 'log' | 'career'

function renderPage(page: Page): React.ReactNode {
  switch (page) {
    case 'dashboard': return <DashboardPage />
    case 'skills':    return <SkillsPage />
    case 'log':       return <PracticeLogPage />
    case 'career':    return <CareerPage />
    default:          return <DashboardPage />
  }
}

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('skills')

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--surface-0)' }}
    >
      <Sidebar
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p as Page)}
      />
      <div className="flex-1 overflow-hidden min-w-0">
        {renderPage(currentPage)}
      </div>
    </div>
  )
}
