
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    // Replaced rounded-2xl with rounded-none for perfectly sharp corners
    <div className={`bg-slate-900/50 border border-slate-800 rounded-none p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};