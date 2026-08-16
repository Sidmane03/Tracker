import React from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { SkillTree } from '@/features/skill-tree/components/SkillTree'

export const SkillsPage: React.FC = () => (
  <PageWrapper
    title="Skill Tree"
    subtitle="Explore and rate your confidence across all topics"
  >
    <SkillTree />
  </PageWrapper>
)
