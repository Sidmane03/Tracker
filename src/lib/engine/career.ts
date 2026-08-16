import type { CareerRole, Category } from '@/types/domain'

export interface RoleCategoryBreakdown {
  categoryId: string
  categoryTitle: string
  categoryColor: string
  weight: number
  readiness: number
  weightedScore: number
  status: 'Strong' | 'Developing' | 'Gap'
}

export interface RoleReadinessSummary {
  role: CareerRole
  readiness: number
  categoryBreakdowns: RoleCategoryBreakdown[]
  keyGaps: RoleCategoryBreakdown[]
}

/**
 * Computes the readiness score (0 - 100%) for a single career role
 * by applying role-specific category weights to category readiness scores.
 */
export function calculateRoleReadiness(
  role: CareerRole,
  categoryScores: Record<string, number>,
  categories: Record<string, Category>
): RoleReadinessSummary {
  const categoryBreakdowns: RoleCategoryBreakdown[] = []
  let totalWeightedScore = 0
  let totalWeight = 0

  for (const [catId, weight] of Object.entries(role.categoryWeights)) {
    if (weight <= 0) continue

    const category = categories[catId]
    const readiness = categoryScores[catId] ?? 0
    const weightedScore = readiness * weight

    totalWeightedScore += weightedScore
    totalWeight += weight

    const status: 'Strong' | 'Developing' | 'Gap' =
      readiness >= 70 ? 'Strong' : readiness >= 40 ? 'Developing' : 'Gap'

    categoryBreakdowns.push({
      categoryId: catId,
      categoryTitle: category?.title || catId,
      categoryColor: category?.color || 'cat-blue',
      weight,
      readiness,
      weightedScore: Math.round(weightedScore * 10) / 10,
      status,
    })
  }

  // Normalize by total weight in case weights don't perfectly equal 1.0
  const normalizedReadiness =
    totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0
  const clampedReadiness = Math.max(0, Math.min(100, normalizedReadiness))

  // Sort breakdown descending by weight
  categoryBreakdowns.sort((a, b) => b.weight - a.weight)

  // Identify high-priority gaps (weight >= 0.15 with readiness < 50%)
  const keyGaps = categoryBreakdowns.filter(
    (b) => b.weight >= 0.15 && b.readiness < 50
  )

  return {
    role,
    readiness: clampedReadiness,
    categoryBreakdowns,
    keyGaps,
  }
}

/**
 * Computes readiness for all available career roles, sorted descending by readiness.
 */
export function calculateAllRolesReadiness(
  roles: CareerRole[],
  categoryScores: Record<string, number>,
  categories: Record<string, Category>
): RoleReadinessSummary[] {
  const summaries = roles.map((role) =>
    calculateRoleReadiness(role, categoryScores, categories)
  )

  summaries.sort((a, b) => b.readiness - a.readiness)
  return summaries
}
