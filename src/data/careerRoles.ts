import type { CareerRole } from '@/types/domain'

export const CAREER_ROLES: CareerRole[] = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Focus on SQL, statistics, data manipulation, and visualization',
    icon: 'BarChart3',
    categoryWeights: {
      'cat-sql': 0.30,
      'cat-stats': 0.25,
      'cat-programming': 0.20,
      'cat-data-science': 0.15,
      'cat-cs-fundamentals': 0.05,
      'cat-aptitude-se': 0.05,
    },
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Focus on ML algorithms, statistics, Python, and research',
    icon: 'FlaskConical',
    categoryWeights: {
      'cat-ml': 0.30,
      'cat-stats': 0.25,
      'cat-programming': 0.20,
      'cat-data-science': 0.15,
      'cat-sql': 0.05,
      'cat-dsa': 0.05,
    },
  },
  {
    id: 'ml-engineer',
    title: 'ML Engineer',
    description: 'Focus on ML systems, Python/DSA, math, and production ML',
    icon: 'Cpu',
    categoryWeights: {
      'cat-ml': 0.35,
      'cat-programming': 0.25,
      'cat-dsa': 0.20,
      'cat-stats': 0.10,
      'cat-cs-fundamentals': 0.07,
      'cat-aptitude-se': 0.03,
    },
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    description: 'Focus on LLMs, ML integration, backend systems, and Python',
    icon: 'Bot',
    categoryWeights: {
      'cat-ml': 0.25,
      'cat-programming': 0.25,
      'cat-aptitude-se': 0.20,
      'cat-dsa': 0.15,
      'cat-stats': 0.10,
      'cat-cs-fundamentals': 0.05,
    },
  },
  {
    id: 'backend-swe',
    title: 'Backend / SWE',
    description: 'Focus on DSA, system design, CS fundamentals, and APIs',
    icon: 'Server',
    categoryWeights: {
      'cat-dsa': 0.35,
      'cat-aptitude-se': 0.25,
      'cat-cs-fundamentals': 0.20,
      'cat-sql': 0.10,
      'cat-programming': 0.10,
    },
  },
]
