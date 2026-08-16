import { describe, it, expect } from 'vitest'
import { validateBackupJson } from '../backup'
import { SEED_CURRICULUM } from '@/data/curriculum'
import { CAREER_ROLES } from '@/data/careerRoles'
import type { AppState } from '@/types/domain'

describe('Storage - Backup Validation', () => {
  const validMockState: AppState = {
    ...SEED_CURRICULUM,
    practiceLogs: [],
    careerRoles: CAREER_ROLES,
    preferences: {
      theme: 'dark',
      decayHalfLifeDays: 21,
    },
  }

  it('successfully validates a valid AppState JSON string', () => {
    const jsonString = JSON.stringify(validMockState)
    const result = validateBackupJson(jsonString)
    expect(result.valid).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.data?.categoryOrder.length).toBeGreaterThan(0)
  })

  it('rejects empty or non-string inputs', () => {
    expect(validateBackupJson('').valid).toBe(false)
    // @ts-expect-error test invalid type
    expect(validateBackupJson(null).valid).toBe(false)
  })

  it('rejects malformed JSON syntax', () => {
    const result = validateBackupJson('{ invalid json: true ')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Malformed JSON')
  })

  it('rejects backup missing categories', () => {
    const invalid = { ...validMockState, categories: undefined }
    const result = validateBackupJson(JSON.stringify(invalid))
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Missing or invalid "categories"')
  })

  it('rejects backup missing categoryOrder', () => {
    const invalid = { ...validMockState, categoryOrder: [] }
    const result = validateBackupJson(JSON.stringify(invalid))
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Missing or empty "categoryOrder"')
  })

  it('rejects backup with unmapped categoryOrder', () => {
    const invalid = { ...validMockState, categoryOrder: ['cat-unknown-999'] }
    const result = validateBackupJson(JSON.stringify(invalid))
    expect(result.valid).toBe(false)
    expect(result.error).toContain('No valid categories found')
  })
})
