import { describe, it, expect } from 'vitest'
import {
  getTopStrengths,
  getTopWeaknesses,
  getCriticalSkillGaps,
  getDashboardSummaryMetrics,
} from '../analytics'
import type { Subtopic, Category, Topic, AppState } from '@/types/domain'
import type { ScoreBreakdown } from '../types'

describe('Analytics Engine', () => {
  const categories: Record<string, Category> = {
    'cat-dsa': { id: 'cat-dsa', title: 'DSA', icon: 'GitBranch', description: 'DSA', color: 'cat-purple', topicIds: ['top-trees'] },
    'cat-py': { id: 'cat-py', title: 'Python', icon: 'Code2', description: 'Python', color: 'cat-blue', topicIds: ['top-py'] },
  }

  const topics: Record<string, Topic> = {
    'top-trees': { id: 'top-trees', title: 'Trees', categoryId: 'cat-dsa', subtopicIds: ['sub-bst', 'sub-trie'], isArchived: false },
    'top-py': { id: 'top-py', title: 'Python Basics', categoryId: 'cat-py', subtopicIds: ['sub-lists', 'sub-dicts'], isArchived: false },
  }

  const subtopics: Subtopic[] = [
    { id: 'sub-bst', title: 'BST', topicId: 'top-trees', categoryId: 'cat-dsa', conceptConfidence: 5, targetProblemQuota: 5, weight: 3, isArchived: false },
    { id: 'sub-trie', title: 'Trie', topicId: 'top-trees', categoryId: 'cat-dsa', conceptConfidence: 1, targetProblemQuota: 5, weight: 3, isArchived: false },
    { id: 'sub-lists', title: 'Lists', topicId: 'top-py', categoryId: 'cat-py', conceptConfidence: 4, targetProblemQuota: 5, weight: 2, isArchived: false },
    { id: 'sub-dicts', title: 'Dicts', topicId: 'top-py', categoryId: 'cat-py', conceptConfidence: 2, targetProblemQuota: 5, weight: 2, isArchived: false },
  ]

  const scores: Record<string, ScoreBreakdown> = {
    'sub-bst': { conceptScore: 100, masteryScore: 80, retentionScore: 100, volumeScore: 100, totalReadiness: 92 },
    'sub-trie': { conceptScore: 0, masteryScore: 0, retentionScore: 0, volumeScore: 0, totalReadiness: 0 },
    'sub-lists': { conceptScore: 75, masteryScore: 50, retentionScore: 70, volumeScore: 60, totalReadiness: 66 },
    'sub-dicts': { conceptScore: 25, masteryScore: 0, retentionScore: 25, volumeScore: 0, totalReadiness: 15 },
  }

  it('ranks Top Strengths in descending order of readiness', () => {
    const strengths = getTopStrengths(subtopics, scores, categories, topics, 2)
    expect(strengths.length).toBe(2)
    expect(strengths[0].subtopic.id).toBe('sub-bst')
    expect(strengths[0].readiness).toBe(92)
    expect(strengths[1].subtopic.id).toBe('sub-lists')
    expect(strengths[1].readiness).toBe(66)
  })

  it('identifies Top Weaknesses among initiated topics with low scores', () => {
    const weaknesses = getTopWeaknesses(subtopics, scores, categories, topics, 2)
    expect(weaknesses.length).toBeGreaterThan(0)
    // sub-dicts has conceptConfidence 2 (initiated) and readiness 15
    expect(weaknesses[0].subtopic.id).toBe('sub-dicts')
  })

  it('identifies Critical Skill Gaps with high weight and low readiness', () => {
    const gaps = getCriticalSkillGaps(subtopics, scores, categories, topics, 3)
    // sub-trie has weight 3 and readiness 0 -> high gap impact (3 * 100 = 300)
    // sub-dicts has weight 2 and readiness 15 -> impact (2 * 85 = 170)
    expect(gaps.length).toBe(2)
    expect(gaps[0].subtopic.id).toBe('sub-trie')
    expect(gaps[1].subtopic.id).toBe('sub-dicts')
  })

  it('aggregates dashboard summary metrics correctly', () => {
    const mockState: AppState = {
      categories,
      topics,
      subtopics: {
        'sub-bst': subtopics[0],
        'sub-trie': subtopics[1],
        'sub-lists': subtopics[2],
        'sub-dicts': subtopics[3],
      },
      categoryOrder: ['cat-dsa', 'cat-py'],
      practiceLogs: [
        { id: '1', categoryId: 'cat-dsa', topicId: 'top-trees', subtopicId: 'sub-bst', difficulty: 'Hard', outcome: 'Solved', timeSpentMinutes: 30, accuracyPercent: 100, timestamp: 1 },
        { id: '2', categoryId: 'cat-dsa', topicId: 'top-trees', subtopicId: 'sub-bst', difficulty: 'Medium', outcome: 'Solved', timeSpentMinutes: 30, accuracyPercent: 80, timestamp: 2 },
      ],
      careerRoles: [],
      preferences: { theme: 'dark', decayHalfLifeDays: 21 },
    }

    const metrics = getDashboardSummaryMetrics(mockState, scores)
    expect(metrics.totalProblems).toBe(2)
    expect(metrics.totalStudyHours).toBe('1.0')
    expect(metrics.activeSubtopicsCount).toBe(3) // bst (conf 5), lists (conf 4), dicts (conf 2)
    expect(metrics.masteredCount).toBe(1) // bst (readiness 92)
    expect(metrics.averageAccuracy).toBe(90)
  })
})
