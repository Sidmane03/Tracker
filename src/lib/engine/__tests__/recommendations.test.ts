import { describe, it, expect } from 'vitest'
import {
  calculatePriorityScore,
  getRecommendedTopics,
} from '../recommendations'
import type { Subtopic, Category, Topic, CareerRole } from '@/types/domain'
import type { ScoreBreakdown } from '../types'

describe('Recommendation Engine', () => {
  const categories: Record<string, Category> = {
    'cat-dsa': { id: 'cat-dsa', title: 'DSA', icon: 'GitBranch', description: '', color: 'cat-purple', topicIds: ['top-trees'] },
    'cat-sql': { id: 'cat-sql', title: 'SQL', icon: 'Database', description: '', color: 'cat-green', topicIds: ['top-sql'] },
  }

  const topics: Record<string, Topic> = {
    'top-trees': { id: 'top-trees', title: 'Trees', categoryId: 'cat-dsa', subtopicIds: ['sub-bst'], isArchived: false },
    'top-sql': { id: 'top-sql', title: 'SQL Queries', categoryId: 'cat-sql', subtopicIds: ['sub-joins'], isArchived: false },
  }

  const subtopics: Subtopic[] = [
    { id: 'sub-bst', title: 'BST', topicId: 'top-trees', categoryId: 'cat-dsa', conceptConfidence: 2, targetProblemQuota: 5, weight: 3, isArchived: false },
    { id: 'sub-joins', title: 'JOINs', topicId: 'top-sql', categoryId: 'cat-sql', conceptConfidence: 4, targetProblemQuota: 5, weight: 2, isArchived: false },
  ]

  const scores: Record<string, ScoreBreakdown> = {
    'sub-bst': { conceptScore: 25, masteryScore: 10, retentionScore: 30, volumeScore: 20, totalReadiness: 20 },
    'sub-joins': { conceptScore: 75, masteryScore: 60, retentionScore: 90, volumeScore: 80, totalReadiness: 73 },
  }

  it('calculates higher priority score for larger readiness deficit and decay boost', () => {
    // sub-bst has deficit 80 (100 - 20), weight 3, decay boost 1.6
    const scoreBst = calculatePriorityScore(20, 3, 30, 0.2)
    // sub-joins has deficit 27 (100 - 73), weight 2, decay boost 1.0
    const scoreJoins = calculatePriorityScore(73, 2, 90, 0.2)

    expect(scoreBst).toBeGreaterThan(scoreJoins)
  })

  it('boosts recommendations matching targeted career role category weights', () => {
    const sweRole: CareerRole = {
      id: 'swe',
      title: 'SWE',
      description: '',
      icon: '',
      categoryWeights: { 'cat-dsa': 0.40, 'cat-sql': 0.05 },
    }

    const recs = getRecommendedTopics(subtopics, scores, categories, topics, sweRole, 2)
    expect(recs[0].subtopic.id).toBe('sub-bst')
    expect(recs[0].reason).toContain('Revision Due')
  })

  it('filters out fully mastered topics with healthy retention', () => {
    const masteredSub: Subtopic = {
      id: 'sub-master',
      title: 'Mastered Topic',
      topicId: 'top-trees',
      categoryId: 'cat-dsa',
      conceptConfidence: 5,
      targetProblemQuota: 5,
      weight: 1,
      isArchived: false,
    }

    const testScores = {
      ...scores,
      'sub-master': { conceptScore: 100, masteryScore: 100, retentionScore: 95, volumeScore: 100, totalReadiness: 98 },
    }

    const recs = getRecommendedTopics([...subtopics, masteredSub], testScores, categories, topics, undefined, 5)
    expect(recs.find((r) => r.subtopic.id === 'sub-master')).toBeUndefined()
  })
})
