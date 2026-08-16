import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardPage } from '@/pages/DashboardPage'
import { SkillsPage } from '@/pages/SkillsPage'
import { PracticeLogPage } from '@/pages/PracticeLogPage'
import { CareerPage } from '@/pages/CareerPage'
import { QuickLogModal } from '@/features/practice-log/components/QuickLogModal'
import { DataManagementModal } from '@/components/settings/DataManagementModal'
import { ScoreBreakdownModal } from '@/features/skill-tree/components/ScoreBreakdownModal'

type Page = 'dashboard' | 'skills' | 'log' | 'career'

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [quickLogOpen, setQuickLogOpen] = useState(false)
  const [preselectedSubtopicId, setPreselectedSubtopicId] = useState<string | undefined>()
  const [inspectSubtopicId, setInspectSubtopicId] = useState<string | undefined>()
  const [dataModalOpen, setDataModalOpen] = useState(false)

  const handleOpenQuickLog = (subtopicId?: string) => {
    setPreselectedSubtopicId(subtopicId)
    setQuickLogOpen(true)
  }

  const handleInspectSubtopic = (subtopicId: string) => {
    setInspectSubtopicId(subtopicId)
  }

  // Global keyboard shortcut: Alt + L to quick log
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'l') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l')) {
        e.preventDefault()
        handleOpenQuickLog()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={(p) => setCurrentPage(p as Page)}
            onOpenQuickLog={handleOpenQuickLog}
            onInspectSubtopic={handleInspectSubtopic}
          />
        )
      case 'skills':
        return (
          <SkillsPage
            onOpenQuickLog={handleOpenQuickLog}
            onInspectSubtopic={handleInspectSubtopic}
          />
        )
      case 'log':
        return <PracticeLogPage />
      case 'career':
        return (
          <CareerPage
            onNavigateToSkills={() => setCurrentPage('skills')}
            onOpenQuickLog={() => handleOpenQuickLog()}
          />
        )
      default:
        return (
          <DashboardPage
            onNavigate={(p) => setCurrentPage(p as Page)}
            onOpenQuickLog={handleOpenQuickLog}
            onInspectSubtopic={handleInspectSubtopic}
          />
        )
    }
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--surface-0)' }}
    >
      <Sidebar
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p as Page)}
        onOpenQuickLog={() => handleOpenQuickLog()}
        onOpenDataManagement={() => setDataModalOpen(true)}
      />

      <div className="flex-1 overflow-hidden min-w-0">
        {renderPage()}
      </div>

      {/* ── Global Modals */}
      <QuickLogModal
        isOpen={quickLogOpen}
        onClose={() => {
          setQuickLogOpen(false)
          setPreselectedSubtopicId(undefined)
        }}
        preselectedSubtopicId={preselectedSubtopicId}
      />

      <ScoreBreakdownModal
        isOpen={Boolean(inspectSubtopicId)}
        onClose={() => setInspectSubtopicId(undefined)}
        subtopicId={inspectSubtopicId}
        onOpenQuickLog={handleOpenQuickLog}
      />

      <DataManagementModal
        isOpen={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
      />
    </div>
  )
}
