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
      className="flex flex-col h-full flex-shrink-0 select-none"
      style={{
        width: collapsed ? 56 : 216,
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* ── Logo / Brand */}
      <div
        className="flex items-center gap-3 overflow-hidden flex-shrink-0"
        style={{
          height: 56,
          padding: collapsed ? '0 14px' : '0 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-lg"
          style={{
            width: 28,
            height: 28,
            background: 'var(--accent)',
            boxShadow: '0 0 14px var(--accent-glow)',
          }}
        >
          <Zap size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p
              className="text-sm font-semibold whitespace-nowrap truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              Skill Tracker
            </p>
            <p
              className="text-xs whitespace-nowrap truncate"
              style={{ color: 'var(--text-muted)' }}
            >
              Career Readiness
            </p>
          </div>
        )}
      </div>

      {/* ── Quick Log Action Button */}
      <div className="p-2">
        <button
          onClick={onOpenQuickLog}
          className="w-full flex items-center justify-center gap-2 rounded-[var(--radius-md)] cursor-pointer text-white font-medium shadow-[0_0_15px_var(--accent-glow)] transition-transform active:scale-95"
          style={{
            height: 36,
            background: 'var(--accent)',
          }}
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
              className="w-full flex items-center gap-2.5 rounded-[var(--radius-md)] cursor-pointer text-left"
              style={{
                height: 36,
                padding: collapsed ? '0 10px' : '0 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--accent)/20' : '1px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'
                if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
              }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Data & Backup */}
      <div style={{ padding: '4px 8px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onOpenDataManagement}
          className="w-full flex items-center gap-2.5 rounded-[var(--radius-md)] cursor-pointer text-left"
          style={{
            height: 34,
            padding: collapsed ? '0 10px' : '0 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: 'var(--text-muted)',
            background: 'transparent',
          }}
          title={collapsed ? 'Data & Backup' : undefined}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
          }}
        >
          <Database size={16} className="flex-shrink-0" />
          {!collapsed && <span className="text-xs font-medium truncate">Data &amp; Backup</span>}
        </button>
      </div>

      {/* ── Collapse toggle */}
      <div style={{ padding: '4px 8px 8px 8px' }}>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-center rounded-[var(--radius-md)] cursor-pointer"
          style={{
            height: 30,
            color: 'var(--text-muted)',
            background: 'transparent',
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  )
}
