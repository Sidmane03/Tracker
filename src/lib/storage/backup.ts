import type { AppState } from '@/types/domain'

export interface BackupValidationResult {
  valid: boolean
  error?: string
  data?: AppState
}

/**
 * Validates a JSON backup string against the AppState schema.
 */
export function validateBackupJson(jsonString: string): BackupValidationResult {
  if (!jsonString || typeof jsonString !== 'string') {
    return { valid: false, error: 'Backup data is empty or not a string.' }
  }

  try {
    const data = JSON.parse(jsonString) as AppState

    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Backup is not a valid JSON object.' }
    }

    // Required core keys
    if (!data.categories || typeof data.categories !== 'object') {
      return { valid: false, error: 'Missing or invalid "categories" map in backup.' }
    }

    if (!data.topics || typeof data.topics !== 'object') {
      return { valid: false, error: 'Missing or invalid "topics" map in backup.' }
    }

    if (!data.subtopics || typeof data.subtopics !== 'object') {
      return { valid: false, error: 'Missing or invalid "subtopics" map in backup.' }
    }

    if (!Array.isArray(data.categoryOrder) || data.categoryOrder.length === 0) {
      return { valid: false, error: 'Missing or empty "categoryOrder" array in backup.' }
    }

    if (!Array.isArray(data.practiceLogs)) {
      return { valid: false, error: 'Missing or invalid "practiceLogs" array in backup.' }
    }

    if (!data.preferences || typeof data.preferences !== 'object') {
      return { valid: false, error: 'Missing or invalid "preferences" object in backup.' }
    }

    // Sanity check: Ensure categoryOrder items exist in categories
    const validCategories = data.categoryOrder.filter((id) => Boolean(data.categories[id]))
    if (validCategories.length === 0) {
      return { valid: false, error: 'No valid categories found matching the categoryOrder.' }
    }

    return { valid: true, data }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'JSON parse failed'
    return { valid: false, error: `Malformed JSON: ${msg}` }
  }
}

/**
 * Generates and triggers a browser download for the current application state.
 */
export function exportBackupToFile(state: AppState): void {
  try {
    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const now = new Date()
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      '-',
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
    ].join('')

    const link = document.createElement('a')
    link.href = url
    link.download = `skill-tracker-backup-${timestamp}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Failed to export backup:', err)
  }
}

/**
 * Reads a File object from input and validates it as backup JSON.
 */
export function readBackupFile(file: File): Promise<BackupValidationResult> {
  return new Promise((resolve) => {
    if (!file.name.endsWith('.json')) {
      resolve({ valid: false, error: 'Please upload a valid .json file.' })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      resolve(validateBackupJson(text))
    }
    reader.onerror = () => {
      resolve({ valid: false, error: 'Failed to read file from disk.' })
    }
    reader.readAsText(file)
  })
}
