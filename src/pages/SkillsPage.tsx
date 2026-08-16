import React from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { SkillTree } from '@/features/skill-tree/components/SkillTree'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'

interface SkillsPageProps {
  onOpenQuickLog?: (subtopicId?: string) => void
  onInspectSubtopic?: (subtopicId: string) => void
}

export const SkillsPage: React.FC<SkillsPageProps> = ({
  onOpenQuickLog,
  onInspectSubtopic,
}) => (
  <PageWrapper
    title="Curriculum &amp; Skill Hierarchy"
    subtitle="Explore and rate your confidence across 8 major domains and 100+ topics (click any subtopic to inspect 4-factor math)"
    actions={
      <Button
        variant="primary"
        size="sm"
        icon={<Plus size={14} />}
        onClick={() => onOpenQuickLog?.()}
      >
        Quick Log
      </Button>
    }
  >
    <SkillTree
      onQuickLog={(sid) => onOpenQuickLog?.(sid)}
      onInspect={(sid) => onInspectSubtopic?.(sid)}
    />
  </PageWrapper>
)
