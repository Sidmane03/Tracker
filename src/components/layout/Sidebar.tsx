import React, { useState } from 'react'
import {
  LayoutDashboard,
  TreePine,
  BookOpen,
  Target,
  ChevronLeft,
  ChevronRight,
  Zap,
  Database,
  Plus,
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ReactNode
  page: string
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    icon: <LayoutDashboard size={18} />, page: 'dashboard' },
  { label: 'Skills',       icon: <TreePine size={18} />,        page: 'skills' },
  { label: 'Practice Logs',icon: <BookOpen size={18} />,        page: 'log' },
  { label: 'Career Paths', icon: <Target size={18} />,          page: 'career' },
]

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onOpenQuickLog?: () => void
  onOpenDataManagement?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onOpenQuickLog,
  onOpenDataManagement,
}) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`flex flex-col h-full flex-shrink-0 select-none bg-[var(--surface-1)] border-r border-[var(--border)] transition-all duration-200 ease-out ${
        collapsed ? 'w-14' : 'w-[216px]'
      }`}
    >
      {/* ── Logo / Brand */}
      <div
        className={`flex items-center gap-3 overflow-hidden flex-shrink-0 h-14 border-b border-[var(--border)] ${
          collapsed ? 'px-3.5' : 'px-4'
        }`}
      >
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-lg w-7 h-7 bg-[var(--accent)] shadow-[0_0_14px_var(--accent-glow)]"
        >
          <Zap size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-semibold whitespace-nowrap truncate text-[var(--text-primary)]">
              Skill Tracker
            </p>
            <p className="text-xs whitespace-nowrap truncate text-[var(--text-muted)]">
              Career Readiness
            </p>
          </div>
        )}
      </div>

      {/* ── Quick Log Action Button */}
      <div className="p-2">
        <button
          onClick={onOpenQuickLog}
          className="w-full h-9 flex items-center justify-center gap-2 rounded-[var(--radius-md)] cursor-pointer text-white font-medium bg-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)] transition-transform active:scale-95 hover:opacity-90"
          title={collapsed ? 'Quick Log Practice' : undefined}
        >
          <Plus size={16} className="flex-shrink-0" />
          {!collapsed && <span className="text-xs font-semibold">Quick Log</span>}
        </button>
      </div>

      {/* ── Navigation */}
      <nav className="flex-1 overflow-hidden p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.page
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              title={collapsed ? item.label : undefined}
              className={`w-full h-9 flex items-center gap-2.5 rounded-[var(--radius-md)] cursor-pointer text-left transition-colors ${
                collapsed ? 'px-2.5 justify-center' : 'px-2.5 justify-start'
              } ${
                isActive
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent-light)] border border-[var(--accent)]/20 font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border border-transparent font-normal'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="text-sm truncate">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Data & Backup */}
      <div className="px-2 py-1 border-t border-[var(--border)]">
        <button
          onClick={onOpenDataManagement}
          className={`w-full h-[34px] flex items-center gap-2.5 rounded-[var(--radius-md)] cursor-pointer text-left text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-colors ${
            collapsed ? 'px-2.5 justify-center' : 'px-2.5 justify-start'
          }`}
          title={collapsed ? 'Data & Backup' : undefined}
        >
          <Database size={16} className="flex-shrink-0" />
          {!collapsed && <span className="text-xs font-medium truncate">Data &amp; Backup</span>}
        </button>
      </div>

      {/* ── Collapse toggle */}
      <div className="px-2 pt-1 pb-2">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full h-[30px] flex items-center justify-center rounded-[var(--radius-md)] cursor-pointer text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  )
}
