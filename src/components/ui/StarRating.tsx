import React, { useState } from 'react'
import { Star } from 'lucide-react'
import type { ConceptConfidence } from '@/types/domain'
import { CONFIDENCE_LABELS } from '@/types/domain'

interface StarRatingProps {
  value: ConceptConfidence
  onChange?: (v: ConceptConfidence) => void
  readonly?: boolean
  size?: number
  showLabel?: boolean
}

const STARS: ConceptConfidence[] = [1, 2, 3, 4, 5]

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = 14,
  showLabel = false,
}) => {
  const [hover, setHover] = useState<number>(0)
  const display = hover || value

  return (
    <div className="inline-flex items-center gap-1" title={CONFIDENCE_LABELS[value]}>
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange?.(star)}
          className={[
            'flex-shrink-0',
            'transition-transform duration-100',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
          ].join(' ')}
          aria-label={`Rate ${star} — ${CONFIDENCE_LABELS[star as ConceptConfidence]}`}
        >
          <Star
            size={size}
            fill={star <= display ? 'var(--warning)' : 'none'}
            stroke={star <= display ? 'var(--warning)' : 'var(--text-muted)'}
            strokeWidth={1.5}
          />
        </button>
      ))}
      {showLabel && (
        <span
          className="text-xs ml-1"
          style={{ color: 'var(--text-muted)' }}
        >
          {CONFIDENCE_LABELS[value]}
        </span>
      )}
    </div>
  )
}
