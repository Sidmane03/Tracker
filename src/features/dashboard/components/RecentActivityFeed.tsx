import React from 'react'
import { useStore } from '@/store'
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'

interface RecentActivityFeedProps {
  onNavigateToLogs?: () => void
}

function getCategoryShortCode(catTitle?: string, catId?: string): string {
  if (!catTitle && !catId) return 'PR'
  const title = (catTitle || catId || '').toUpperCase()
  if (title.includes('PROGRAMMING')) return 'PG'
  if (title.includes('DATA STRUCTURES') || title.includes('DSA')) return 'DS'
  if (title.includes('SQL')) return 'SQ'
  if (title.includes('STATISTICS') || title.includes('PROBABILITY')) return 'ST'
  if (title.includes('DATA SCIENCE')) return 'DC'
  if (title.includes('MACHINE LEARNING') || title.includes('ML')) return 'ML'
  if (title.includes('CS FUNDAMENTALS') || title.includes('CS')) return 'CS'
  if (title.includes('APTITUDE') || title.includes('SE')) return 'AP'
  return title.slice(0, 2)
}

function formatActivityTime(timestamp: number): string {
  const date = new Date(timestamp)
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`
  }
  if (isYesterday(date)) {
    return 'Yesterday'
  }
  const now = Date.now()
  if (now - timestamp < 7 * 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(date, { addSuffix: true })
  }
  return format(date, 'MMM d')
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({
  onNavigateToLogs,
}) => {
  const { practiceLogs, subtopics, categories } = useStore()
  const recent = practiceLogs.slice(0, 5)

  return (
    <section className="rounded-[20px] border border-white/[0.08] bg-[#10192b] p-5 sm:p-6">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#8c98b1] uppercase">
            Keep moving
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
            Recent practice
          </h2>
        </div>
        <button
          type="button"
          onClick={onNavigateToLogs}
          className="text-xs font-bold text-[#aab0ff] hover:text-white transition cursor-pointer"
        >
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#8290aa]">
          No practice logs yet. Use Quick Log to record your first session!
        </div>
      ) : (
        <div className="divide-y divide-white/[0.07]">
          {recent.map((log) => {
            const sub = subtopics[log.subtopicId]
            const cat = categories[log.categoryId]
            const short = getCategoryShortCode(cat?.title, log.categoryId)

            const outcomeLabel =
              log.outcome === 'Solved'
                ? `Solved ${log.timeSpentMinutes ? `(${log.timeSpentMinutes}m)` : ''}`
                : log.outcome === 'Struggled'
                ? 'Reviewed'
                : 'Needed help'

            return (
              <div
                key={log.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                {/* MiniIcon matching Figma */}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#17223a] text-[11px] font-semibold text-[#b8c3dd] mono border border-white/[0.04]">
                  {short}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {sub?.title || log.subtopicId}
                    </p>
                    <span className="text-[11px] text-[#8290aa]">
                      {cat?.title || log.categoryId}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#92a0b8]">
                    <span className="text-[#c1cbde]">{outcomeLabel}</span>
                    <span className="mx-1.5 text-[#52617b]">&bull;</span>
                    <span>{log.difficulty}</span>
                  </p>
                </div>

                <time className="shrink-0 text-right text-[11px] text-[#7f8da7]">
                  {formatActivityTime(log.timestamp)}
                </time>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
