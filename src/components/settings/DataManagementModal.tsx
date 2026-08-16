import React, { useState, useRef } from 'react'
import { Download, Upload, RotateCcw, AlertTriangle, CheckCircle2, FileText } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store'
import { exportBackupToFile, readBackupFile } from '@/lib/storage/backup'
import type { AppState } from '@/types/domain'

interface DataManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const store = useStore()

  const [importStatus, setImportStatus] = useState<{
    success?: boolean
    message?: string
  }>({})
  const [resetConfirming, setResetConfirming] = useState(false)
  const [resetInputText, setResetInputText] = useState('')

  const handleExport = () => {
    const rawState: AppState = {
      categories: store.categories,
      topics: store.topics,
      subtopics: store.subtopics,
      categoryOrder: store.categoryOrder,
      practiceLogs: store.practiceLogs,
      careerRoles: store.careerRoles,
      preferences: store.preferences,
    }
    exportBackupToFile(rawState)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportStatus({})
    const result = await readBackupFile(file)

    if (!result.valid || !result.data) {
      setImportStatus({
        success: false,
        message: result.error || 'Invalid backup file format.',
      })
      return
    }

    const ok = store.importData(JSON.stringify(result.data))
    if (ok) {
      setImportStatus({
        success: true,
        message: `Successfully imported backup! Loaded ${result.data.categoryOrder.length} categories and ${result.data.practiceLogs.length} practice logs.`,
      })
    } else {
      setImportStatus({
        success: false,
        message: 'Store failed to ingest the backup data.',
      })
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleReset = () => {
    store.resetToDefaults()
    setResetConfirming(false)
    setResetInputText('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Data Management & Backup"
      size="md"
    >
      <div className="space-y-6">
        {/* ── Export Section */}
        <div
          className="p-4 rounded-[var(--radius-md)] flex items-start gap-4"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          <div
            className="p-2.5 rounded-lg flex-shrink-0"
            style={{ background: 'var(--accent-subtle)', color: 'var(--accent-light)' }}
          >
            <Download size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Export Backup (JSON)
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 mb-3">
              Download your complete skill progress, ratings, practice sessions, and settings to a local JSON file.
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              onClick={handleExport}
            >
              Download Backup
            </Button>
          </div>
        </div>

        {/* ── Import Section */}
        <div
          className="p-4 rounded-[var(--radius-md)] flex items-start gap-4"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          <div
            className="p-2.5 rounded-lg flex-shrink-0"
            style={{ background: 'var(--info-subtle)', color: 'var(--info)' }}
          >
            <Upload size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Import &amp; Restore
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 mb-3">
              Restore previously exported JSON backup. This will replace the active data state.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              variant="secondary"
              size="sm"
              icon={<FileText size={14} />}
              onClick={() => fileInputRef.current?.click()}
            >
              Select Backup File (.json)
            </Button>

            {/* Import Status Alert */}
            {importStatus.message && (
              <div
                className="mt-3 p-2.5 rounded text-xs flex items-start gap-2"
                style={{
                  background: importStatus.success ? 'var(--success-subtle)' : 'var(--danger-subtle)',
                  color: importStatus.success ? 'var(--success)' : 'var(--danger)',
                  border: `1px solid ${importStatus.success ? 'var(--success)/30' : 'var(--danger)/30'}`,
                }}
              >
                {importStatus.success ? (
                  <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                )}
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Reset Section */}
        <div
          className="p-4 rounded-[var(--radius-md)] flex items-start gap-4"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--danger-subtle)',
          }}
        >
          <div
            className="p-2.5 rounded-lg flex-shrink-0"
            style={{ background: 'var(--danger-subtle)', color: 'var(--danger)' }}
          >
            <RotateCcw size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[var(--danger)]">
              Factory Reset
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 mb-3">
              Reset all scores, confidence ratings, and practice history back to initial curriculum defaults.
            </p>

            {!resetConfirming ? (
              <Button
                variant="danger"
                size="sm"
                icon={<RotateCcw size={14} />}
                onClick={() => setResetConfirming(true)}
              >
                Reset to Defaults
              </Button>
            ) : (
              <div
                className="p-3 rounded-lg space-y-3"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--danger)/40' }}
              >
                <div className="flex items-center gap-2 text-xs text-[var(--danger)] font-medium">
                  <AlertTriangle size={14} />
                  <span>Type &ldquo;RESET&rdquo; to permanently clear all data:</span>
                </div>
                <input
                  type="text"
                  placeholder="RESET"
                  value={resetInputText}
                  onChange={(e) => setResetInputText(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded bg-[var(--surface-2)] text-[var(--text-primary)] border border-[var(--border-strong)] focus:border-[var(--danger)]"
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={resetInputText !== 'RESET'}
                    onClick={handleReset}
                  >
                    Confirm Reset
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setResetConfirming(false)
                      setResetInputText('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
