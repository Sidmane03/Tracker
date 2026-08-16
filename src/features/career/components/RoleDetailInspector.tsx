import {
  Star,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { RoleReadinessSummary } from '@/lib/engine'

interface RoleDetailInspectorProps {
  summary: RoleReadinessSummary
  isPrimaryTarget: boolean
  onTogglePrimaryTarget: (roleId: string) => void
  onNavigateToSkills?: (categoryId?: string) => void
  onOpenQuickLog?: () => void
}

export const RoleDetailInspector: React.FC<RoleDetailInspectorProps> = ({
  summary,
  isPrimaryTarget,
  onTogglePrimaryTarget,
  onNavigateToSkills,
  onOpenQuickLog,
}) => {
  const { role, categoryBreakdowns, keyGaps } = summary

  return (
    <div
      className="p-5 rounded-[var(--radius-xl)] border border-[var(--border)] space-y-6"
      style={{
        background: 'linear-gradient(180deg, var(--surface-2) 0%, var(--surface-1) 100%)',
      }}
    >
      {/* ── Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {role.title} &mdash; Competency Matrix &amp; Gap Analysis
            </h2>
            {isPrimaryTarget && (
              <Badge variant="accent" dot>
                Primary Target
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {role.description}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant={isPrimaryTarget ? 'secondary' : 'primary'}
            size="sm"
            icon={<Star size={13} className={isPrimaryTarget ? 'fill-current text-[var(--warning)]' : ''} />}
            onClick={() => onTogglePrimaryTarget(role.id)}
          >
            {isPrimaryTarget ? 'Active Goal' : 'Set as Primary Goal'}
          </Button>

          {onOpenQuickLog && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Zap size={13} />}
              onClick={onOpenQuickLog}
            >
              Log Practice
            </Button>
          )}
        </div>
      </div>

      {/* ── High-Impact Domain Gap Alerts */}
      {keyGaps.length > 0 && (
        <div
          className="p-4 rounded-[var(--radius-md)] border border-[var(--warning)]/30 space-y-2.5"
          style={{ background: 'var(--warning-subtle)' }}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--warning)]">
            <AlertTriangle size={15} />
            <span>High-Impact Skill Gaps for {role.title}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            These domains carry substantial weight for this career track but currently have low measured mastery:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {keyGaps.map((gap) => (
              <div
                key={gap.categoryId}
                className="p-2.5 rounded bg-[var(--surface-1)] border border-[var(--border)] flex items-center justify-between gap-2"
              >
                <div>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">
                    {gap.categoryTitle}
                  </span>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    Carries {Math.round(gap.weight * 100)}% role weight &bull; Current: {gap.readiness}%
                  </div>
                </div>
                {onNavigateToSkills && (
                  <button
                    onClick={() => onNavigateToSkills(gap.categoryId)}
                    className="text-[10px] text-[var(--accent-light)] hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
                  >
                    <span>Practice</span>
                    <ArrowUpRight size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Full Category Weight Distribution Table */}
      <div>
        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Layers size={14} />
          <span>Curriculum Domain Weights &amp; Measured Competencies</span>
        </h3>

        <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-1)]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)] font-medium bg-[var(--surface-2)]">
                <th className="py-2.5 px-3">Curriculum Domain</th>
                <th className="py-2.5 px-3">Role Weight</th>
                <th className="py-2.5 px-3">Domain Readiness</th>
                <th className="py-2.5 px-3">Points Contributed</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {categoryBreakdowns.map((b) => {
                const statusVariant =
                  b.status === 'Strong'
                    ? 'success'
                    : b.status === 'Developing'
                    ? 'accent'
                    : 'warning'

                return (
                  <tr key={b.categoryId} className="hover:bg-[var(--surface-2)]/70 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-[var(--text-primary)]">
                      {b.categoryTitle}
                    </td>

                    <td className="py-2.5 px-3 font-mono font-medium text-[var(--text-secondary)]">
                      {Math.round(b.weight * 100)}%
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-16 rounded-full overflow-hidden"
                          style={{ height: 4, background: 'var(--surface-3)' }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${b.readiness}%`,
                              background: b.readiness >= 70 ? 'var(--success)' : b.readiness >= 40 ? 'var(--accent)' : 'var(--warning)',
                            }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[var(--text-primary)]">{b.readiness}%</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[var(--accent-light)] font-bold">
                      {b.weightedScore} pts
                    </td>

                    <td className="py-2.5 px-3">
                      <Badge variant={statusVariant}>{b.status}</Badge>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      {onNavigateToSkills && (
                        <button
                          onClick={() => onNavigateToSkills(b.categoryId)}
                          className="text-[11px] text-[var(--accent-light)] hover:underline cursor-pointer"
                        >
                          View topics &rarr;
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
