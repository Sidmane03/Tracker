// ─── Core Domain Types ────────────────────────────────────────────────────────

export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Outcome = 'Solved' | 'Struggled' | 'Needed Help'
export type ConceptConfidence = 1 | 2 | 3 | 4 | 5

export const CONFIDENCE_LABELS: Record<ConceptConfidence, string> = {
  1: 'Novice',
  2: 'Familiar',
  3: 'Comfortable',
  4: 'Proficient',
  5: 'Mastered',
}

// ─── Skill Hierarchy ──────────────────────────────────────────────────────────

export interface Subtopic {
  id: string
  title: string
  topicId: string
  categoryId: string
  conceptConfidence: ConceptConfidence
  targetProblemQuota: number     // recommended number of problems to solve
  weight: number                 // 1-3 relative importance multiplier
  lastPracticedAt?: number       // epoch ms
  notes?: string
  isArchived: boolean
}

export interface Topic {
  id: string
  title: string
  categoryId: string
  subtopicIds: string[]
  isArchived: boolean
}

export interface Category {
  id: string
  title: string
  icon: string           // Lucide icon component name
  description: string
  color: string          // CSS custom property name, e.g. 'cat-blue'
  topicIds: string[]
}

// ─── Practice Tracking ───────────────────────────────────────────────────────

export interface PracticeLog {
  id: string
  categoryId: string
  topicId: string
  subtopicId: string
  difficulty: Difficulty
  outcome: Outcome
  timeSpentMinutes: number
  accuracyPercent?: number       // 0-100
  notes?: string
  resourceRef?: string           // e.g. URL or book reference
  timestamp: number              // epoch ms
}

// ─── Career Readiness ────────────────────────────────────────────────────────

export interface CareerRole {
  id: string
  title: string
  description: string
  icon: string
  categoryWeights: Record<string, number>   // categoryId → 0.0-1.0 (sum to 1.0)
}

// ─── User Configuration ───────────────────────────────────────────────────────

export interface UserPreferences {
  theme: 'dark' | 'light'
  decayHalfLifeDays: number        // default 21
  primaryCareerTarget?: string     // CareerRole.id
}

// ─── Normalized App State ────────────────────────────────────────────────────

export interface AppState {
  categories: Record<string, Category>
  topics: Record<string, Topic>
  subtopics: Record<string, Subtopic>
  categoryOrder: string[]           // ordered list of category IDs for rendering
  practiceLogs: PracticeLog[]
  careerRoles: CareerRole[]
  preferences: UserPreferences
}
