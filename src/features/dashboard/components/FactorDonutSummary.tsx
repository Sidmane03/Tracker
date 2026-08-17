import React from 'react'
import { PieChart } from 'lucide-react'
import { Card } from '@/components/ui'
import { SCORE_WEIGHTS } from '@/lib/engine'
import { useStore } from '@/store'

interface FactorDonutSummaryProps {
  onInspectSubtopic?: (subtopicId: string) => void
}

export const FactorDonutSummary: React.FC<FactorDonutSummaryProps> = () => {
  const store = useStore()
  const subtopicList = Object.values(store.subtopics)

  let avgConcept = 0
  let avgMastery = 0
  let avgRetention = 0
  let avgVolume = 0

  if (subtopicList.length > 0) {
    let totC = 0
    let totM = 0
    let totR = 0
    let totV = 0
    for (const s of subtopicList) {
      const score = store.getSubtopicReadiness(s.id)
      totC += score.conceptScore
      totM += score.masteryScore
      totR += score.retentionScore
      totV += score.volumeScore
    }
    avgConcept = Math.round(totC / subtopicList.length)
    avgMastery = Math.round(totM / subtopicList.length)
    avgRetention = Math.round(totR / subtopicList.length)
    avgVolume = Math.round(totV / subtopicList.length)
  }

  // Factor contributions
  const factors = [
    {
      name: 'Practice Mastery',
      weight: '40%',
      color: '#10b981', // Emerald
      score: avgMastery,
      points: Math.round(SCORE_WEIGHTS.mastery * avgMastery * 10) / 10,
      maxPoints: 40,
    },
    {
      name: 'Concept Confidence',
      weight: '25%',
      color: '#a855f7', // Purple
      score: avgConcept,
      points: Math.round(SCORE_WEIGHTS.concept * avgConcept * 10) / 10,
      maxPoints: 25,
    },
    {
      name: 'Retention Recency',
      weight: '20%',
      color: '#f59e0b', // Amber
      score: avgRetention,
      points: Math.round(SCORE_WEIGHTS.retention * avgRetention * 10) / 10,
      maxPoints: 20,
    },
    {
      name: 'Practice Volume',
      weight: '15%',
      color: '#38bdf8', // Sky
      score: avgVolume,
      points: Math.round(SCORE_WEIGHTS.volume * avgVolume * 10) / 10,
      maxPoints: 15,
    },
  ]

  // Donut SVG parameters
  const size = 110
  const strokeWidth = 9
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <Card className="flex flex-col justify-between group hover:border-[var(--border-strong)] transition-all h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PieChart size={15} className="text-[var(--accent)]" />
            <h3 className="text-xs font-bold text-[var(--text-primary)]">
              4-Factor Evidence
            </h3>
          </div>
          <span className="text-[10px] font-medium text-[var(--text-muted)]">
            Weight Distribution
          </span>
        </div>

        {/* ── Donut Graphic (Matching Daily Summary Ring) */}
        <div className="flex items-center justify-center py-2 relative">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--surface-3)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Slice 1: Mastery (40%) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#10b981"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${circumference * 0.38} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
            />
            {/* Slice 2: Concept (25%) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#a855f7"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${circumference * 0.23} ${circumference}`}
              strokeDashoffset={-circumference * 0.40}
              strokeLinecap="round"
            />
            {/* Slice 3: Retention (20%) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#f59e0b"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${circumference * 0.18} ${circumference}`}
              strokeDashoffset={-circumference * 0.65}
              strokeLinecap="round"
            />
            {/* Slice 4: Volume (15%) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#38bdf8"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${circumference * 0.13} ${circumference}`}
              strokeDashoffset={-circumference * 0.85}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Callout */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold font-mono text-[var(--text-primary)]">
              4-Factor
            </span>
            <span className="text-[8px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Scoring
            </span>
          </div>
        </div>
      </div>

      {/* ── Legend rows below matching screenshot */}
      <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
        {factors.map((f) => (
          <div key={f.name} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: f.color }}
              />
              <span className="text-[var(--text-secondary)] truncate">
                {f.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="text-[var(--text-muted)]">{f.weight}</span>
              <span className="font-bold text-[var(--text-primary)]">
                {f.points}/{f.maxPoints} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
