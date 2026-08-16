import { describe, it, expect } from 'vitest'
import {
  calculateRoleReadiness,
  calculateAllRolesReadiness,
} from '../career'
import type { CareerRole, Category } from '@/types/domain'

describe('Career Role Readiness Engine', () => {
  const categories: Record<string, Category> = {
    'cat-dsa': { id: 'cat-dsa', title: 'Data Structures & Algorithms', icon: 'GitBranch', description: '', color: 'cat-purple', topicIds: [] },
    'cat-sql': { id: 'cat-sql', title: 'SQL & Database Design', icon: 'Database', description: '', color: 'cat-green', topicIds: [] },
    'cat-stats': { id: 'cat-stats', title: 'Statistics & Probability', icon: 'BarChart2', description: '', color: 'cat-amber', topicIds: [] },
    'cat-programming': { id: 'cat-programming', title: 'Programming & Problem Solving', icon: 'Code2', description: '', color: 'cat-blue', topicIds: [] },
  }

  const backendRole: CareerRole = {
    id: 'backend-swe',
    title: 'Backend / SWE',
    description: 'Focus on DSA, system design, and SQL',
    icon: 'Server',
    categoryWeights: {
      'cat-dsa': 0.50,
      'cat-programming': 0.30,
      'cat-sql': 0.20,
    },
  }

  const dataAnalystRole: CareerRole = {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Focus on SQL and Statistics',
    icon: 'BarChart3',
    categoryWeights: {
      'cat-sql': 0.50,
      'cat-stats': 0.30,
      'cat-programming': 0.20,
    },
  }

  it('yields 100% readiness when all constituent categories are 100%', () => {
    const perfectScores = {
      'cat-dsa': 100,
      'cat-programming': 100,
      'cat-sql': 100,
    }

    const summary = calculateRoleReadiness(backendRole, perfectScores, categories)
    expect(summary.readiness).toBe(100)
    expect(summary.keyGaps.length).toBe(0)
  })

  it('correctly calculates weighted readiness based on category scores', () => {
    // DSA 80% (0.50) = 40
    // Programming 60% (0.30) = 18
    // SQL 20% (0.20) = 4
    // Total = 40 + 18 + 4 = 62%
    const categoryScores = {
      'cat-dsa': 80,
      'cat-programming': 60,
      'cat-sql': 20,
    }

    const summary = calculateRoleReadiness(backendRole, categoryScores, categories)
    expect(summary.readiness).toBe(62)
    // SQL has weight 0.20 and readiness 20 (<50) -> should be identified as a key gap
    expect(summary.keyGaps.length).toBe(1)
    expect(summary.keyGaps[0].categoryId).toBe('cat-sql')
  })

  it('differentiates distinct role scores for asymmetric skill profiles', () => {
    // User is strong in SQL (90) and Stats (80), but weak in DSA (20)
    const categoryScores = {
      'cat-sql': 90,
      'cat-stats': 80,
      'cat-programming': 70,
      'cat-dsa': 20,
    }

    const summaries = calculateAllRolesReadiness([backendRole, dataAnalystRole], categoryScores, categories)

    // Data Analyst: 90*0.50 + 80*0.30 + 70*0.20 = 45 + 24 + 14 = 83%
    // Backend SWE: 20*0.50 + 70*0.30 + 90*0.20 = 10 + 21 + 18 = 49%
    expect(summaries[0].role.id).toBe('data-analyst')
    expect(summaries[0].readiness).toBe(83)
    expect(summaries[1].role.id).toBe('backend-swe')
    expect(summaries[1].readiness).toBe(49)
  })
})
