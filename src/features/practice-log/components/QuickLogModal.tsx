import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store'
import type { Difficulty, Outcome } from '@/types/domain'
import { Clock, FileText, Check, Plus } from 'lucide-react'

interface QuickLogModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedSubtopicId?: string
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  preselectedSubtopicId,
}) => {
  const { categories, topics, subtopics, categoryOrder, addPracticeLog } = useStore()

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('')
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium')
  const [outcome, setOutcome] = useState<Outcome>('Solved')
  const [timeSpentMinutes, setTimeSpentMinutes] = useState<number>(20)
  const [accuracyPercent, setAccuracyPercent] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [resourceRef, setResourceRef] = useState<string>('')
  const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false)
  const [isSaved, setIsSaved] = useState<boolean>(false)

  // Initialize or preselect state when modal opens
  useEffect(() => {
    if (!isOpen) {
      setIsSaved(false)
      return
    }

    if (preselectedSubtopicId && subtopics[preselectedSubtopicId]) {
      const sub = subtopics[preselectedSubtopicId]
      setSelectedSubtopic(sub.id)
      setSelectedTopic(sub.topicId)
      setSelectedCategory(sub.categoryId)
    } else {
      const firstCat = categoryOrder[0] || ''
      setSelectedCategory(firstCat)
      if (firstCat && categories[firstCat]?.topicIds.length > 0) {
        const firstTop = categories[firstCat].topicIds[0]
        setSelectedTopic(firstTop)
        if (firstTop && topics[firstTop]?.subtopicIds.length > 0) {
          setSelectedSubtopic(topics[firstTop].subtopicIds[0])
        }
      }
    }
  }, [isOpen, preselectedSubtopicId, subtopics, categories, topics, categoryOrder])

  // Cascading updates
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId)
    const catTopics = categories[catId]?.topicIds || []
    const nextTopic = catTopics[0] || ''
    setSelectedTopic(nextTopic)
    const nextSubtopics = nextTopic ? topics[nextTopic]?.subtopicIds || [] : []
    setSelectedSubtopic(nextSubtopics[0] || '')
  }

  const handleTopicChange = (topId: string) => {
    setSelectedTopic(topId)
    const nextSubtopics = topics[topId]?.subtopicIds || []
    setSelectedSubtopic(nextSubtopics[0] || '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubtopic || !selectedTopic || !selectedCategory) return

    addPracticeLog({
      categoryId: selectedCategory,
      topicId: selectedTopic,
      subtopicId: selectedSubtopic,
      difficulty,
      outcome,
      timeSpentMinutes: Number(timeSpentMinutes) || 15,
      accuracyPercent: accuracyPercent ? Math.min(100, Math.max(0, Number(accuracyPercent))) : undefined,
      notes: notes.trim() || undefined,
      resourceRef: resourceRef.trim() || undefined,
    })

    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 600)
  }

  const availableTopics = categories[selectedCategory]?.topicIds.map((id) => topics[id]).filter(Boolean) || []
  const availableSubtopics = topics[selectedTopic]?.subtopicIds.map((id) => subtopics[id]).filter(Boolean) || []

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Practice Logger"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ── 1. Cascading Curriculum Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full text-xs h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--accent)]"
            >
              {categoryOrder.map((cid) => (
                <option key={cid} value={cid}>
                  {categories[cid]?.title}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => handleTopicChange(e.target.value)}
              className="w-full text-xs h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--accent)]"
            >
              {availableTopics.map((top) => (
                <option key={top.id} value={top.id}>
                  {top.title}
                </option>
              ))}
            </select>
          </div>

          {/* Subtopic */}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5">
              Subtopic
            </label>
            <select
              value={selectedSubtopic}
              onChange={(e) => setSelectedSubtopic(e.target.value)}
              className="w-full text-xs h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--accent)]"
            >
              {availableSubtopics.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── 2. Problem Difficulty Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5">
            Problem Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => {
              const active = difficulty === d
              const colorClass =
                d === 'Easy'
                  ? 'border-[var(--success)] text-[var(--success)] bg-[var(--success-subtle)]'
                  : d === 'Medium'
                  ? 'border-[var(--warning)] text-[var(--warning)] bg-[var(--warning-subtle)]'
                  : 'border-[var(--danger)] text-[var(--danger)] bg-[var(--danger-subtle)]'

              return (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`h-9 text-xs font-semibold rounded-[var(--radius-sm)] border transition-all cursor-pointer ${
                    active
                      ? `${colorClass} ring-1 ring-current`
                      : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── 3. Practice Outcome Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5">
            Practice Outcome
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['Solved', 'Struggled', 'Needed Help'] as Outcome[]).map((o) => {
              const active = outcome === o
              const activeStyles =
                o === 'Solved'
                  ? 'border-[var(--success)] text-[var(--success)] bg-[var(--success-subtle)]'
                  : o === 'Struggled'
                  ? 'border-[var(--warning)] text-[var(--warning)] bg-[var(--warning-subtle)]'
                  : 'border-[var(--accent)] text-[var(--accent-light)] bg-[var(--accent-subtle)]'

              return (
                <button
                  type="button"
                  key={o}
                  onClick={() => setOutcome(o)}
                  className={`h-9 text-xs font-semibold rounded-[var(--radius-sm)] border transition-all cursor-pointer ${
                    active
                      ? `${activeStyles} ring-1 ring-current`
                      : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  {o}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── 4. Time Spent & Accuracy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5 flex items-center gap-1">
              <Clock size={12} />
              <span>Time Spent (minutes)</span>
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="300"
                value={timeSpentMinutes}
                onChange={(e) => setTimeSpentMinutes(Number(e.target.value))}
                className="w-full text-xs h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--accent)]"
              />
              {[15, 30, 45].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTimeSpentMinutes(m)}
                  className="h-9 px-2.5 text-xs font-medium rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-strong)] cursor-pointer"
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5">
              Accuracy % (Optional)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 100"
              value={accuracyPercent}
              onChange={(e) => setAccuracyPercent(e.target.value)}
              className="w-full text-xs h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* ── 5. Optional Notes & Link Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowOptionalFields((v) => !v)}
            className="text-xs text-[var(--accent-light)] hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <FileText size={12} />
            <span>{showOptionalFields ? 'Hide Notes & URL' : '+ Add Notes or Resource URL'}</span>
          </button>

          {showOptionalFields && (
            <div className="mt-2.5 space-y-2.5 animate-fade-in">
              <div>
                <input
                  type="url"
                  placeholder="Resource Link (LeetCode URL, docs, tutorial)..."
                  value={resourceRef}
                  onChange={(e) => setResourceRef(e.target.value)}
                  className="w-full text-xs h-9 px-3 rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--accent)]"
                />
              </div>
              <div>
                <textarea
                  rows={2}
                  placeholder="Key takeaways, patterns, or complexity notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border)] focus:border-[var(--accent)] resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── 6. Form Actions Footer with proper spacing */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            icon={isSaved ? <Check size={14} /> : <Plus size={14} />}
            disabled={isSaved}
          >
            {isSaved ? 'Logged Successfully!' : 'Save Practice Entry'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
