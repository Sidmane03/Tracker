import React from 'react'
import { useSkillTree } from '../hooks/useSkillTree'
import { CategoryCard } from './CategoryCard'

export const SkillTree: React.FC = () => {
  const { categoryOrder, categories } = useSkillTree()

  return (
    <div className="space-y-3 max-w-4xl">
      {categoryOrder.map((id) => {
        const category = categories[id]
        if (!category) return null
        return <CategoryCard key={id} category={category} />
      })}
    </div>
  )
}
