import { useStore } from '@/store'

export function useSkillTree() {
  const categories   = useStore((s) => s.categories)
  const topics       = useStore((s) => s.topics)
  const subtopics    = useStore((s) => s.subtopics)
  const categoryOrder = useStore((s) => s.categoryOrder)

  const setSubtopicConfidence = useStore((s) => s.setSubtopicConfidence)
  const addCustomSubtopic     = useStore((s) => s.addCustomSubtopic)
  const archiveSubtopic       = useStore((s) => s.archiveSubtopic)
  const updateSubtopicNotes   = useStore((s) => s.updateSubtopicNotes)

  return {
    categories,
    topics,
    subtopics,
    categoryOrder,
    setSubtopicConfidence,
    addCustomSubtopic,
    archiveSubtopic,
    updateSubtopicNotes,
  }
}
