import { describe, it, expect } from 'vitest'
import {
  calculateRetentionScore,
  isRevisionDue,
  evaluateSubtopicStatus,
} from '../decay'

const MS_PER_DAY = 1000 * 60 * 60 * 24

describe('Decay Engine - Exponential Half-Life Curve', () => {
  it('returns 100% when practice just occurred (0 elapsed days)', () => {
    const now = 1000000000000
    const score = calculateRetentionScore(now, 21, now)
    expect(score).toBe(100)
  })

  it('returns exactly ~50% at 1 half-life (21 days)', () => {
    const now = 1000000000000
    const practicedAt = now - 21 * MS_PER_DAY
    const score = calculateRetentionScore(practicedAt, 21, now)
    expect(score).toBe(50)
  })

  it('returns ~25% at 2 half-lives (42 days)', () => {
    const now = 1000000000000
    const practicedAt = now - 42 * MS_PER_DAY
    const score = calculateRetentionScore(practicedAt, 21, now)
    expect(score).toBe(25)
  })

  it('returns ~12% at 3 half-lives (63 days)', () => {
    const now = 1000000000000
    const practicedAt = now - 63 * MS_PER_DAY
    const score = calculateRetentionScore(practicedAt, 21, now)
    expect(score).toBe(13) // Math.round(12.5) -> 13
  })

  it('falls back to concept confidence baseline if never practiced', () => {
    expect(calculateRetentionScore(undefined, 21, Date.now(), 5)).toBe(100)
    expect(calculateRetentionScore(undefined, 21, Date.now(), 3)).toBe(50)
    expect(calculateRetentionScore(undefined, 21, Date.now(), 1)).toBe(0)
    expect(calculateRetentionScore(undefined, 21, Date.now())).toBe(0)
  })
})

describe('Decay Engine - Revision Due Detection', () => {
  it('flags revision due when retention drops below 50% and concept is comfortable+', () => {
    expect(isRevisionDue(45, 50, 0)).toBe(true)
    expect(isRevisionDue(20, 75, 0)).toBe(true)
  })

  it('flags revision due when retention drops below 50% and user has logged practice', () => {
    expect(isRevisionDue(40, 25, 60)).toBe(true)
  })

  it('does NOT flag revision due if retention is high (>=50%)', () => {
    expect(isRevisionDue(75, 100, 80)).toBe(false)
    expect(isRevisionDue(50, 50, 0)).toBe(false)
  })

  it('does NOT flag revision due if topic was untouched / never learned (concept 0, mastery 0)', () => {
    expect(isRevisionDue(10, 0, 0)).toBe(false)
    expect(isRevisionDue(0, 25, 0)).toBe(false) // 25% is Novice/Familiar (conf 2)
  })
})

describe('Decay Engine - Subtopic Status Evaluation', () => {
  it('evaluates status correctly across states', () => {
    // Untouched
    expect(evaluateSubtopicStatus(0, 0, 0, 0)).toBe('Untouched')

    // Revision Due
    expect(evaluateSubtopicStatus(60, 40, 75, 50)).toBe('Revision Due')

    // Mastered (readiness >= 80 and retention >= 70)
    expect(evaluateSubtopicStatus(85, 75, 100, 80)).toBe('Mastered')

    // In Progress (readiness >= 40)
    expect(evaluateSubtopicStatus(55, 60, 50, 40)).toBe('In Progress')

    // Needs Practice (readiness < 40)
    expect(evaluateSubtopicStatus(30, 60, 25, 20)).toBe('Needs Practice')
  })
})
