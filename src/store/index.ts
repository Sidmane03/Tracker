import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AppState, UserPreferences, ConceptConfidence, PracticeLog, Subtopic } from '@/types/domain'
import { SEED_CURRICULUM } from '@/data/curriculum'
import { CAREER_ROLES } from '@/data/careerRoles'
import {
  calculateSubtopicScore,
  calculateTopicScore,
  calculateCategoryScore,
  calculateOverallScore,
  calculateRetentionScore,
  isRevisionDue,
  type ScoreBreakdown,
} from '@/lib/engine'

// ─── Action & Selector Interface ──────────────────────────────────────────────

interface StoreActions {
  // Preferences
  setPreferences: (prefs: Partial<UserPreferences>) => void

  // Subtopic management
  setSubtopicConfidence: (subtopicId: string, confidence: ConceptConfidence) => void
  addCustomSubtopic: (topicId: string, title: string, quota?: number) => void
  archiveSubtopic: (subtopicId: string) => void
  updateSubtopicNotes: (subtopicId: string, notes: string) => void

  // Practice logs
  addPracticeLog: (log: Omit<PracticeLog, 'id' | 'timestamp'>) => void
  deletePracticeLog: (logId: string) => void

  // Dynamic Calculated Selectors
  getSubtopicReadiness: (subtopicId: string) => ScoreBreakdown
  getTopicReadiness: (topicId: string) => number
  getCategoryReadiness: (categoryId: string) => number
  getOverallReadiness: () => number
  getRevisionDueSubtopics: () => Subtopic[]

  // Data portability
  exportData: () => string
  importData: (json: string) => boolean

  // Reset
  resetToDefaults: () => void
}

// ─── Default values ───────────────────────────────────────────────────────────

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  decayHalfLifeDays: 21,
}

function makeInitialState(): AppState {
  return {
    ...SEED_CURRICULUM,
    practiceLogs: [],
    careerRoles: CAREER_ROLES,
    preferences: defaultPreferences,
  }
}

// ─── ID generator ────────────────────────────────────────────────────────────

function genId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      // ── Initial state (from seed)
      ...makeInitialState(),

      // ── Preferences
      setPreferences: (prefs) =>
        set((s) => ({ preferences: { ...s.preferences, ...prefs } })),

      // ── Subtopic: update confidence + recency timestamp
      setSubtopicConfidence: (subtopicId, confidence) =>
        set((s) => ({
          subtopics: {
            ...s.subtopics,
            [subtopicId]: {
              ...s.subtopics[subtopicId],
              conceptConfidence: confidence,
              lastPracticedAt: Date.now(),
            },
          },
        })),

      // ── Add a custom subtopic to a topic
      addCustomSubtopic: (topicId, title, quota = 5) => {
        const topic = get().topics[topicId]
        if (!topic) return
        const id = genId('sub-custom')
        const newSubtopic = {
          id,
          title: title.trim(),
          topicId,
          categoryId: topic.categoryId,
          conceptConfidence: 1 as ConceptConfidence,
          targetProblemQuota: quota,
          weight: 1,
          isArchived: false,
        }
        set((s) => ({
          subtopics: { ...s.subtopics, [id]: newSubtopic },
          topics: {
            ...s.topics,
            [topicId]: {
              ...s.topics[topicId],
              subtopicIds: [...s.topics[topicId].subtopicIds, id],
            },
          },
        }))
      },

      // ── Archive subtopic
      archiveSubtopic: (subtopicId) =>
        set((s) => ({
          subtopics: {
            ...s.subtopics,
            [subtopicId]: { ...s.subtopics[subtopicId], isArchived: true },
          },
        })),

      // ── Update notes
      updateSubtopicNotes: (subtopicId, notes) =>
        set((s) => ({
          subtopics: {
            ...s.subtopics,
            [subtopicId]: { ...s.subtopics[subtopicId], notes },
          },
        })),

      // ── Practice log: add (prepend for recency-first display)
      addPracticeLog: (log) => {
        const entry: PracticeLog = { ...log, id: genId('log'), timestamp: Date.now() }
        set((s) => ({ practiceLogs: [entry, ...s.practiceLogs] }))
        // Also bump recency on the subtopic
        set((s) => ({
          subtopics: {
            ...s.subtopics,
            [log.subtopicId]: {
              ...s.subtopics[log.subtopicId],
              lastPracticedAt: Date.now(),
            },
          },
        }))
      },

      // ── Practice log: delete by id
      deletePracticeLog: (logId) =>
        set((s) => ({ practiceLogs: s.practiceLogs.filter((l) => l.id !== logId) })),

      // ── Dynamic Computed Selectors
      getSubtopicReadiness: (subtopicId) => {
        const state = get()
        const subtopic = state.subtopics[subtopicId]
        if (!subtopic) {
          return { conceptScore: 0, masteryScore: 0, retentionScore: 0, volumeScore: 0, totalReadiness: 0 }
        }
        const halfLife = state.preferences.decayHalfLifeDays || 21
        const retention = calculateRetentionScore(
          subtopic.lastPracticedAt,
          halfLife,
          Date.now(),
          subtopic.conceptConfidence
        )
        return calculateSubtopicScore(subtopic, state.practiceLogs, retention)
      },

      getTopicReadiness: (topicId) => {
        const state = get()
        const topic = state.topics[topicId]
        if (!topic) return 0
        const subtopicList = topic.subtopicIds.map((id) => state.subtopics[id]).filter(Boolean)
        const subScores: Record<string, ScoreBreakdown> = {}
        for (const s of subtopicList) {
          subScores[s.id] = get().getSubtopicReadiness(s.id)
        }
        return calculateTopicScore(subtopicList, subScores)
      },

      getCategoryReadiness: (categoryId) => {
        const state = get()
        const category = state.categories[categoryId]
        if (!category) return 0
        const topicScores = category.topicIds.map((tid) => get().getTopicReadiness(tid))
        return calculateCategoryScore(topicScores)
      },

      getOverallReadiness: () => {
        const state = get()
        const categoryScores = state.categoryOrder.map((cid) => get().getCategoryReadiness(cid))
        return calculateOverallScore(categoryScores)
      },

      getRevisionDueSubtopics: () => {
        const state = get()
        const dueList: Subtopic[] = []
        for (const sub of Object.values(state.subtopics)) {
          if (sub.isArchived) continue
          const scores = get().getSubtopicReadiness(sub.id)
          if (isRevisionDue(scores.retentionScore, scores.conceptScore, scores.masteryScore)) {
            dueList.push(sub)
          }
        }
        return dueList
      },

      // ── Export the entire state as JSON
      exportData: () => {
        const {
          setPreferences, setSubtopicConfidence, addCustomSubtopic, archiveSubtopic,
          updateSubtopicNotes, addPracticeLog, deletePracticeLog,
          getSubtopicReadiness, getTopicReadiness, getCategoryReadiness,
          getOverallReadiness, getRevisionDueSubtopics,
          exportData, importData, resetToDefaults, ...data
        } = get()
        return JSON.stringify(data, null, 2)
      },

      // ── Import state from JSON (returns true on success)
      importData: (json) => {
        try {
          const parsed = JSON.parse(json) as AppState
          if (!parsed.categories || !parsed.topics || !parsed.subtopics) return false
          set(parsed)
          return true
        } catch {
          return false
        }
      },

      // ── Reset everything to seed defaults
      resetToDefaults: () => set(makeInitialState()),
    }),
    {
      name: 'skill-tracker-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
