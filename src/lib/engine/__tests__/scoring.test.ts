import { describe, it, expect } from 'vitest'
import {
  calculateConceptScore,
  calculateMasteryScore,
  calculateVolumeScore,
  calculateSubtopicScore,
  calculateTopicScore,
  calculateCategoryScore,
  calculateOverallScore,
} from '../scoring'
import type { Subtopic, PracticeLog } from '@/types/domain'

describe('Scoring Engine - Concept Confidence', () => {
  it('correctly maps 1-5 confidence levels to 0-100% scores', () => {
    expect(calculateConceptScore(1)).toBe(0)
    expect(calculateConceptScore(2)).toBe(25)
    expect(calculateConceptScore(3)).toBe(50)
    expect(calculateConceptScore(4)).toBe(75)
    expect(calculateConceptScore(5)).toBe(100)
  })
})

describe('Scoring Engine - Mastery Calculation', () => {
  it('returns 0 when no logs exist', () => {
    expect(calculateMasteryScore([], 10)).toBe(0)
  })

  it('correctly calculates mastery for easy solved problems', () => {
    // 5 Easy problems solved = 5 * (1.0 * 1.0) = 5 points
    // Target quota = 5 (Target points = 5 * 2.0 = 10)
    // Score = 5 / 10 = 50%
    const logs: PracticeLog[] = Array(5).fill({
      id: 'log1',
      categoryId: 'cat1',
      topicId: 'top1',
      subtopicId: 'sub1',
      difficulty: 'Easy',
      outcome: 'Solved',
      timeSpentMinutes: 10,
      timestamp: Date.now(),
    })

    expect(calculateMasteryScore(logs, 5)).toBe(50)
  })

  it('correctly weights hard problems and partial outcomes', () => {
    // 2 Hard solved = 2 * (3.5 * 1.0) = 7.0
    // 2 Medium struggled = 2 * (2.0 * 0.5) = 2.0
    // 2 Easy needed help = 2 * (1.0 * 0.25) = 0.5
    // Total earned = 9.5 points
    // Target quota = 5 (Target points = 10)
    // Score = 9.5 / 10 = 95%
    const logs: PracticeLog[] = [
      { id: '1', categoryId: 'c', topicId: 't', subtopicId: 's', difficulty: 'Hard', outcome: 'Solved', timeSpentMinutes: 20, timestamp: 1 },
      { id: '2', categoryId: 'c', topicId: 't', subtopicId: 's', difficulty: 'Hard', outcome: 'Solved', timeSpentMinutes: 20, timestamp: 1 },
      { id: '3', categoryId: 'c', topicId: 't', subtopicId: 's', difficulty: 'Medium', outcome: 'Struggled', timeSpentMinutes: 15, timestamp: 1 },
      { id: '4', categoryId: 'c', topicId: 't', subtopicId: 's', difficulty: 'Medium', outcome: 'Struggled', timeSpentMinutes: 15, timestamp: 1 },
      { id: '5', categoryId: 'c', topicId: 't', subtopicId: 's', difficulty: 'Easy', outcome: 'Needed Help', timeSpentMinutes: 5, timestamp: 1 },
      { id: '6', categoryId: 'c', topicId: 't', subtopicId: 's', difficulty: 'Easy', outcome: 'Needed Help', timeSpentMinutes: 5, timestamp: 1 },
    ]

    expect(calculateMasteryScore(logs, 5)).toBe(95)
  })

  it('caps mastery score at 100% when exceeding quota', () => {
    const logs: PracticeLog[] = Array(10).fill({
      id: 'log',
      categoryId: 'c',
      topicId: 't',
      subtopicId: 's',
      difficulty: 'Hard',
      outcome: 'Solved',
      timeSpentMinutes: 15,
      timestamp: 1,
    })
    // 10 * 3.5 = 35 points on target 10 points -> should cap at 100
    expect(calculateMasteryScore(logs, 5)).toBe(100)
  })
})

describe('Scoring Engine - Volume Calculation', () => {
  it('correctly calculates volume and caps at 100%', () => {
    expect(calculateVolumeScore(0, 10)).toBe(0)
    expect(calculateVolumeScore(5, 10)).toBe(50)
    expect(calculateVolumeScore(10, 10)).toBe(100)
    expect(calculateVolumeScore(15, 10)).toBe(100)
  })
})

describe('Scoring Engine - Subtopic Readiness Formula', () => {
  it('computes complete 4-factor readiness score correctly', () => {
    // C = 5 (100) -> 0.25 * 100 = 25
    // 5 medium solved on quota 5 -> M = 50% -> 0.40 * 50 = 20
    // Retention D = 80 -> 0.20 * 80 = 16
    // Volume V = 5/5 (100) -> 0.15 * 100 = 15
    // Total R = 25 + 20 + 16 + 15 = 76
    const subtopic: Subtopic = {
      id: 'sub-test',
      title: 'Binary Search',
      topicId: 'top-search',
      categoryId: 'cat-dsa',
      conceptConfidence: 5,
      targetProblemQuota: 5,
      weight: 3,
      isArchived: false,
    }

    const logs: PracticeLog[] = Array(5).fill({
      id: 'l',
      categoryId: 'cat-dsa',
      topicId: 'top-search',
      subtopicId: 'sub-test',
      difficulty: 'Medium',
      outcome: 'Struggled', // 5 * (2.0 * 0.5) = 5 points -> 50%
      timeSpentMinutes: 10,
      timestamp: 1,
    })

    const result = calculateSubtopicScore(subtopic, logs, 80)

    expect(result.conceptScore).toBe(100)
    expect(result.masteryScore).toBe(50)
    expect(result.retentionScore).toBe(80)
    expect(result.volumeScore).toBe(100)
    expect(result.totalReadiness).toBe(76)
  })
})

describe('Scoring Engine - Hierarchical Aggregations', () => {
  it('computes weighted topic score correctly', () => {
    const s1: Subtopic = { id: 's1', title: 'S1', topicId: 't1', categoryId: 'c1', conceptConfidence: 1, targetProblemQuota: 5, weight: 3, isArchived: false }
    const s2: Subtopic = { id: 's2', title: 'S2', topicId: 't1', categoryId: 'c1', conceptConfidence: 1, targetProblemQuota: 5, weight: 1, isArchived: false }

    const scores = {
      s1: { conceptScore: 0, masteryScore: 0, retentionScore: 0, volumeScore: 0, totalReadiness: 80 },
      s2: { conceptScore: 0, masteryScore: 0, retentionScore: 0, volumeScore: 0, totalReadiness: 40 },
    }

    // Weighted average: (80*3 + 40*1) / (3 + 1) = (240 + 40) / 4 = 70
    expect(calculateTopicScore([s1, s2], scores)).toBe(70)
  })

  it('ignores archived subtopics in topic score', () => {
    const s1: Subtopic = { id: 's1', title: 'S1', topicId: 't1', categoryId: 'c1', conceptConfidence: 1, targetProblemQuota: 5, weight: 1, isArchived: false }
    const s2: Subtopic = { id: 's2', title: 'S2', topicId: 't1', categoryId: 'c1', conceptConfidence: 1, targetProblemQuota: 5, weight: 1, isArchived: true }

    const scores = {
      s1: { conceptScore: 0, masteryScore: 0, retentionScore: 0, volumeScore: 0, totalReadiness: 80 },
      s2: { conceptScore: 0, masteryScore: 0, retentionScore: 0, volumeScore: 0, totalReadiness: 0 },
    }

    expect(calculateTopicScore([s1, s2], scores)).toBe(80)
  })

  it('computes category and overall averages correctly', () => {
    expect(calculateCategoryScore([80, 60, 100])).toBe(80)
    expect(calculateOverallScore([90, 70, 80, 60])).toBe(75)
    expect(calculateOverallScore([])).toBe(0)
  })
})
