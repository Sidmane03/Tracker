import React, { useState } from 'react'
import {
  LayoutDashboard,
  TreePine,
  BookOpen,
  Target,
  ChevronLeft,
  ChevronRight,
  Settings,
} from 'lucide-react'
import { useStore } from '@/store'

interface NavItem {
  label: string
  icon: React.ReactNode
  page: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',     icon: <LayoutDashboard size={18} />, page: 'dashboard' },
  { label: 'Skills',        icon: <TreePine size={18} />,        page: 'skills' },
  { label: 'Practice Log',  icon: <BookOpen size={18} />,        page: 'log' },
  { label: 'Career',        icon: <Target size={18} />,          page: 'career' },
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
  onOpenDataManagement,
}) => {
  const [collapsed, setCollapsed] = useState(false)
  const { preferences, careerRoles } = useStore()
  const primaryRole = careerRoles.find((r) => r.id === preferences.primaryCareerTarget)

  return (
    <aside
      className={`flex flex-col h-full flex-shrink-0 select-none bg-[#0c1426] border-r border-white/[0.08] px-4 py-5 transition-all duration-200 ease-out ${
        collapsed ? 'w-16' : 'w-[238px]'
      }`}
    >
      {/* ── Logo matching Figma */}
      <div className="mb-10 flex items-center gap-2.5 px-2">
        <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#7c83ff] text-sm font-bold text-white shadow-[0_6px_18px_rgba(124,131,255,.22)] flex-shrink-0">
          S
        </div>
        {!collapsed && (
          <span className="text-[15px] font-bold tracking-[-0.03em] text-white">
            SkillTrack
          </span>
        )}
      </div>

      {/* ── Primary Navigation matching Figma */}
      <nav className="space-y-1 flex-1" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.page
          return (
            <button
              key={item.page}
              type="button"
              onClick={() => onNavigate(item.page)}
              title={collapsed ? item.label : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition cursor-pointer ${
                collapsed ? 'justify-center px-0' : ''
              } ${
                isActive
                  ? 'bg-[#202a50] text-white shadow-[inset_3px_0_0_#8d93ff] font-medium'
                  : 'text-[#9da9c1] hover:bg-white/[0.045] hover:text-[#e6ebfb]'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* ── Bottom Section: Settings & User Profile matching Figma */}
      <div className="mt-auto border-t border-white/[0.08] pt-4">
        <button
          type="button"
          onClick={onOpenDataManagement}
          className={`mb-4 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-[#9da9c1] transition hover:bg-white/[0.045] hover:text-white cursor-pointer ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title={collapsed ? 'Settings & Data' : undefined}
        >
          <Settings size={17} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* ── User Avatar & Status Card matching Figma */}
        <div
          className={`flex items-center gap-2.5 px-2 py-1 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[#293654] text-xs font-bold text-[#dce3fb] flex-shrink-0">
            HS
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Harsh Sharma</p>
              <p className="mt-0.5 text-[11px] text-[#8290aa] truncate">
                {primaryRole ? primaryRole.title : 'Learning mode'}
              </p>
            </div>
          )}
        </div>

        {/* ── Mini Collapse Toggle */}
        <div className="mt-3 pt-2 border-t border-white/[0.04] flex justify-end">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="w-full flex items-center justify-center rounded-lg py-1 text-[#8290aa] hover:text-white hover:bg-white/[0.045] transition cursor-pointer text-xs"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>
    </aside>
  )
}
