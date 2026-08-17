import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-[var(--surface-1)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}