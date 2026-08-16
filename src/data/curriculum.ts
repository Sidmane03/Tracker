import type { Category, Topic, Subtopic, AppState } from '@/types/domain'

// ─── Helper builders ──────────────────────────────────────────────────────────

function cat(
  id: string,
  title: string,
  icon: string,
  description: string,
  color: string,
  topicIds: string[],
): Category {
  return { id, title, icon, description, color, topicIds }
}

function topic(id: string, title: string, categoryId: string, subtopicIds: string[]): Topic {
  return { id, title, categoryId, subtopicIds, isArchived: false }
}

function sub(
  id: string,
  title: string,
  topicId: string,
  categoryId: string,
  quota = 8,
  weight = 2,
): Subtopic {
  return {
    id, title, topicId, categoryId,
    conceptConfidence: 1,
    targetProblemQuota: quota,
    weight,
    isArchived: false,
  }
}

// ─── Curriculum ───────────────────────────────────────────────────────────────

const categories: Record<string, Category> = {
  // 1 — Programming
  'cat-programming': cat(
    'cat-programming', 'Programming', 'Code2',
    'Python, OOP, problem solving fundamentals',
    'cat-blue', ['top-python', 'top-problem-solving'],
  ),
  // 2 — DSA
  'cat-dsa': cat(
    'cat-dsa', 'DSA', 'GitBranch',
    'Data structures and algorithms for interviews',
    'cat-purple', ['top-searching', 'top-sorting', 'top-linear', 'top-trees', 'top-graphs', 'top-hashing', 'top-heap'],
  ),
  // 3 — SQL
  'cat-sql': cat(
    'cat-sql', 'SQL', 'Database',
    'Relational databases, query optimization, analytics',
    'cat-green', ['top-sql-basics', 'top-sql-advanced'],
  ),
  // 4 — Statistics
  'cat-stats': cat(
    'cat-stats', 'Statistics & Probability', 'BarChart2',
    'Statistical inference, distributions, and probability theory',
    'cat-orange', ['top-statistics', 'top-probability'],
  ),
  // 5 — Data Science
  'cat-data-science': cat(
    'cat-data-science', 'Data Science', 'TrendingUp',
    'EDA, data cleaning, feature engineering',
    'cat-cyan', ['top-eda', 'top-feature-eng'],
  ),
  // 6 — Machine Learning
  'cat-ml': cat(
    'cat-ml', 'Machine Learning', 'Brain',
    'Supervised, unsupervised, and model evaluation',
    'cat-pink', ['top-supervised', 'top-unsupervised', 'top-model-eval'],
  ),
  // 7 — CS Fundamentals
  'cat-cs-fundamentals': cat(
    'cat-cs-fundamentals', 'CS Fundamentals', 'Cpu',
    'DBMS, OOP, OS, Networking core concepts',
    'cat-indigo', ['top-dbms', 'top-oop', 'top-os', 'top-networks'],
  ),
  // 8 — Aptitude & SE
  'cat-aptitude-se': cat(
    'cat-aptitude-se', 'Aptitude & SE', 'Puzzle',
    'Quantitative, logical reasoning, and software engineering',
    'cat-amber', ['top-quant', 'top-logical', 'top-complexity', 'top-se'],
  ),
}

const topics: Record<string, Topic> = {
  // ── Programming
  'top-python': topic('top-python', 'Python', 'cat-programming', [
    'sub-py-fundamentals', 'sub-py-strings', 'sub-py-lists', 'sub-py-tuples',
    'sub-py-dicts', 'sub-py-sets', 'sub-py-functions', 'sub-py-oop',
    'sub-py-numpy', 'sub-py-pandas', 'sub-py-advanced',
  ]),
  'top-problem-solving': topic('top-problem-solving', 'Problem Solving', 'cat-programming', [
    'sub-ps-patterns', 'sub-ps-complexity', 'sub-ps-sliding-window', 'sub-ps-two-pointers',
  ]),

  // ── DSA
  'top-searching': topic('top-searching', 'Searching', 'cat-dsa', [
    'sub-binary-search', 'sub-linear-search', 'sub-binary-search-variants',
  ]),
  'top-sorting': topic('top-sorting', 'Sorting', 'cat-dsa', [
    'sub-bubble-sort', 'sub-selection-sort', 'sub-insertion-sort',
    'sub-merge-sort', 'sub-quick-sort', 'sub-heap-sort', 'sub-counting-sort',
  ]),
  'top-linear': topic('top-linear', 'Linear Structures', 'cat-dsa', [
    'sub-stack', 'sub-queue', 'sub-deque', 'sub-linked-list', 'sub-doubly-linked',
  ]),
  'top-trees': topic('top-trees', 'Trees', 'cat-dsa', [
    'sub-binary-tree', 'sub-bst', 'sub-avl', 'sub-tree-traversal', 'sub-trie',
  ]),
  'top-graphs': topic('top-graphs', 'Graphs', 'cat-dsa', [
    'sub-dfs', 'sub-bfs', 'sub-dijkstra', 'sub-bellman-ford', 'sub-topological-sort', 'sub-union-find',
  ]),
  'top-hashing': topic('top-hashing', 'Hashing', 'cat-dsa', [
    'sub-hash-table', 'sub-hash-map', 'sub-collision-resolution',
  ]),
  'top-heap': topic('top-heap', 'Heap / Priority Queue', 'cat-dsa', [
    'sub-min-heap', 'sub-max-heap', 'sub-heapify',
  ]),

  // ── SQL
  'top-sql-basics': topic('top-sql-basics', 'SQL Basics', 'cat-sql', [
    'sub-sql-select', 'sub-sql-joins', 'sub-sql-aggregates', 'sub-sql-group-by',
    'sub-sql-subqueries', 'sub-sql-case',
  ]),
  'top-sql-advanced': topic('top-sql-advanced', 'Advanced SQL', 'cat-sql', [
    'sub-sql-window', 'sub-sql-cte', 'sub-sql-indexing', 'sub-sql-transactions', 'sub-sql-stored-procs',
  ]),

  // ── Stats
  'top-statistics': topic('top-statistics', 'Statistics', 'cat-stats', [
    'sub-descriptive', 'sub-distributions', 'sub-hypothesis', 'sub-confidence-intervals',
    'sub-regression-stats', 'sub-anova',
  ]),
  'top-probability': topic('top-probability', 'Probability', 'cat-stats', [
    'sub-prob-theory', 'sub-bayes', 'sub-combinatorics', 'sub-random-variables',
  ]),

  // ── Data Science
  'top-eda': topic('top-eda', 'Data Analysis & EDA', 'cat-data-science', [
    'sub-eda-basics', 'sub-data-cleaning', 'sub-pandas-profiling', 'sub-visualization',
    'sub-outlier-detection',
  ]),
  'top-feature-eng': topic('top-feature-eng', 'Feature Engineering', 'cat-data-science', [
    'sub-feature-selection', 'sub-encoding', 'sub-scaling', 'sub-feature-creation',
  ]),

  // ── ML
  'top-supervised': topic('top-supervised', 'Supervised Learning', 'cat-ml', [
    'sub-linear-reg', 'sub-logistic-reg', 'sub-decision-tree', 'sub-random-forest',
    'sub-svm', 'sub-knn', 'sub-naive-bayes', 'sub-gradient-boosting',
  ]),
  'top-unsupervised': topic('top-unsupervised', 'Unsupervised Learning', 'cat-ml', [
    'sub-kmeans', 'sub-hierarchical', 'sub-pca', 'sub-dbscan',
  ]),
  'top-model-eval': topic('top-model-eval', 'Model Evaluation', 'cat-ml', [
    'sub-cross-validation', 'sub-metrics', 'sub-bias-variance', 'sub-hyperparameter-tuning',
    'sub-confusion-matrix',
  ]),

  // ── CS Fundamentals
  'top-dbms': topic('top-dbms', 'DBMS', 'cat-cs-fundamentals', [
    'sub-normalization', 'sub-transactions', 'sub-keys-constraints', 'sub-er-model',
  ]),
  'top-oop': topic('top-oop', 'OOP Concepts', 'cat-cs-fundamentals', [
    'sub-inheritance', 'sub-polymorphism', 'sub-encapsulation', 'sub-design-patterns',
  ]),
  'top-os': topic('top-os', 'Operating Systems', 'cat-cs-fundamentals', [
    'sub-processes', 'sub-scheduling', 'sub-memory', 'sub-deadlocks', 'sub-file-systems',
  ]),
  'top-networks': topic('top-networks', 'Computer Networks', 'cat-cs-fundamentals', [
    'sub-osi', 'sub-tcp-ip', 'sub-http', 'sub-dns', 'sub-sockets',
  ]),

  // ── Aptitude & SE
  'top-quant': topic('top-quant', 'Quantitative Aptitude', 'cat-aptitude-se', [
    'sub-number-theory', 'sub-speed-distance', 'sub-permutations', 'sub-profit-loss',
  ]),
  'top-logical': topic('top-logical', 'Logical Reasoning', 'cat-aptitude-se', [
    'sub-syllogisms', 'sub-blood-relations', 'sub-puzzles', 'sub-seating',
  ]),
  'top-complexity': topic('top-complexity', 'Algorithm Complexity', 'cat-aptitude-se', [
    'sub-time-complexity', 'sub-space-complexity', 'sub-amortized',
  ]),
  'top-se': topic('top-se', 'Software Engineering', 'cat-aptitude-se', [
    'sub-git', 'sub-apis-rest', 'sub-docker', 'sub-solid-principles',
  ]),
}

const subtopics: Record<string, Subtopic> = {
  // ── Python
  'sub-py-fundamentals':   sub('sub-py-fundamentals',   'Python Fundamentals',   'top-python', 'cat-programming', 5,  2),
  'sub-py-strings':        sub('sub-py-strings',        'Strings',               'top-python', 'cat-programming', 5,  2),
  'sub-py-lists':          sub('sub-py-lists',          'Lists',                 'top-python', 'cat-programming', 5,  2),
  'sub-py-tuples':         sub('sub-py-tuples',         'Tuples',                'top-python', 'cat-programming', 4,  1),
  'sub-py-dicts':          sub('sub-py-dicts',          'Dictionaries',          'top-python', 'cat-programming', 6,  2),
  'sub-py-sets':           sub('sub-py-sets',           'Sets',                  'top-python', 'cat-programming', 4,  1),
  'sub-py-functions':      sub('sub-py-functions',      'Functions & Closures',  'top-python', 'cat-programming', 6,  2),
  'sub-py-oop':            sub('sub-py-oop',            'OOP in Python',         'top-python', 'cat-programming', 8,  3),
  'sub-py-numpy':          sub('sub-py-numpy',          'NumPy',                 'top-python', 'cat-programming', 6,  2),
  'sub-py-pandas':         sub('sub-py-pandas',         'Pandas',                'top-python', 'cat-programming', 8,  3),
  'sub-py-advanced':       sub('sub-py-advanced',       'Advanced Python',       'top-python', 'cat-programming', 8,  2),

  // ── Problem Solving
  'sub-ps-patterns':       sub('sub-ps-patterns',       'Common Patterns',          'top-problem-solving', 'cat-programming', 8,  3),
  'sub-ps-complexity':     sub('sub-ps-complexity',     'Complexity Analysis',      'top-problem-solving', 'cat-programming', 5,  2),
  'sub-ps-sliding-window': sub('sub-ps-sliding-window', 'Sliding Window',           'top-problem-solving', 'cat-programming', 6,  2),
  'sub-ps-two-pointers':   sub('sub-ps-two-pointers',   'Two Pointers',             'top-problem-solving', 'cat-programming', 6,  2),

  // ── Searching
  'sub-binary-search':         sub('sub-binary-search',         'Binary Search',          'top-searching', 'cat-dsa', 10, 3),
  'sub-linear-search':         sub('sub-linear-search',         'Linear Search',          'top-searching', 'cat-dsa', 4,  1),
  'sub-binary-search-variants':sub('sub-binary-search-variants','BS Variants & Edge Cases','top-searching','cat-dsa', 8,  2),

  // ── Sorting
  'sub-bubble-sort':    sub('sub-bubble-sort',    'Bubble Sort',    'top-sorting', 'cat-dsa', 4,  1),
  'sub-selection-sort': sub('sub-selection-sort', 'Selection Sort', 'top-sorting', 'cat-dsa', 4,  1),
  'sub-insertion-sort': sub('sub-insertion-sort', 'Insertion Sort', 'top-sorting', 'cat-dsa', 4,  1),
  'sub-merge-sort':     sub('sub-merge-sort',     'Merge Sort',     'top-sorting', 'cat-dsa', 8,  3),
  'sub-quick-sort':     sub('sub-quick-sort',     'Quick Sort',     'top-sorting', 'cat-dsa', 8,  3),
  'sub-heap-sort':      sub('sub-heap-sort',      'Heap Sort',      'top-sorting', 'cat-dsa', 6,  2),
  'sub-counting-sort':  sub('sub-counting-sort',  'Counting / Radix Sort', 'top-sorting', 'cat-dsa', 5, 2),

  // ── Linear Structures
  'sub-stack':           sub('sub-stack',           'Stack',           'top-linear', 'cat-dsa', 8,  3),
  'sub-queue':           sub('sub-queue',           'Queue',           'top-linear', 'cat-dsa', 8,  3),
  'sub-deque':           sub('sub-deque',           'Deque',           'top-linear', 'cat-dsa', 5,  2),
  'sub-linked-list':     sub('sub-linked-list',     'Linked List',     'top-linear', 'cat-dsa', 10, 3),
  'sub-doubly-linked':   sub('sub-doubly-linked',   'Doubly Linked List', 'top-linear', 'cat-dsa', 6, 2),

  // ── Trees
  'sub-binary-tree':    sub('sub-binary-tree',    'Binary Tree',      'top-trees', 'cat-dsa', 8,  2),
  'sub-bst':            sub('sub-bst',            'BST',              'top-trees', 'cat-dsa', 10, 3),
  'sub-avl':            sub('sub-avl',            'AVL / Balanced Trees', 'top-trees', 'cat-dsa', 6, 2),
  'sub-tree-traversal': sub('sub-tree-traversal', 'Tree Traversal',   'top-trees', 'cat-dsa', 8,  3),
  'sub-trie':           sub('sub-trie',           'Trie',             'top-trees', 'cat-dsa', 6,  2),

  // ── Graphs
  'sub-dfs':               sub('sub-dfs',               'DFS',               'top-graphs', 'cat-dsa', 10, 3),
  'sub-bfs':               sub('sub-bfs',               'BFS',               'top-graphs', 'cat-dsa', 10, 3),
  'sub-dijkstra':          sub('sub-dijkstra',          'Dijkstra',          'top-graphs', 'cat-dsa', 8,  3),
  'sub-bellman-ford':      sub('sub-bellman-ford',      'Bellman-Ford',      'top-graphs', 'cat-dsa', 6,  2),
  'sub-topological-sort':  sub('sub-topological-sort',  'Topological Sort',  'top-graphs', 'cat-dsa', 6,  2),
  'sub-union-find':        sub('sub-union-find',        'Union-Find / DSU',  'top-graphs', 'cat-dsa', 6,  2),

  // ── Hashing
  'sub-hash-table':           sub('sub-hash-table',           'Hash Table',           'top-hashing', 'cat-dsa', 6,  2),
  'sub-hash-map':             sub('sub-hash-map',             'Hash Map',             'top-hashing', 'cat-dsa', 8,  3),
  'sub-collision-resolution': sub('sub-collision-resolution', 'Collision Resolution', 'top-hashing', 'cat-dsa', 4,  1),

  // ── Heap
  'sub-min-heap': sub('sub-min-heap', 'Min Heap',  'top-heap', 'cat-dsa', 6, 2),
  'sub-max-heap': sub('sub-max-heap', 'Max Heap',  'top-heap', 'cat-dsa', 6, 2),
  'sub-heapify':  sub('sub-heapify',  'Heapify',   'top-heap', 'cat-dsa', 5, 2),

  // ── SQL Basics
  'sub-sql-select':     sub('sub-sql-select',     'SELECT / WHERE / ORDER BY', 'top-sql-basics', 'cat-sql', 5,  2),
  'sub-sql-joins':      sub('sub-sql-joins',      'JOINs',                     'top-sql-basics', 'cat-sql', 8,  3),
  'sub-sql-aggregates': sub('sub-sql-aggregates', 'Aggregate Functions',        'top-sql-basics', 'cat-sql', 6,  2),
  'sub-sql-group-by':   sub('sub-sql-group-by',   'GROUP BY / HAVING',          'top-sql-basics', 'cat-sql', 6,  2),
  'sub-sql-subqueries': sub('sub-sql-subqueries', 'Subqueries',                 'top-sql-basics', 'cat-sql', 6,  2),
  'sub-sql-case':       sub('sub-sql-case',       'CASE Statements',            'top-sql-basics', 'cat-sql', 4,  1),

  // ── SQL Advanced
  'sub-sql-window':       sub('sub-sql-window',       'Window Functions',    'top-sql-advanced', 'cat-sql', 10, 3),
  'sub-sql-cte':          sub('sub-sql-cte',          'CTEs',                'top-sql-advanced', 'cat-sql', 6,  2),
  'sub-sql-indexing':     sub('sub-sql-indexing',     'Indexing',            'top-sql-advanced', 'cat-sql', 6,  2),
  'sub-sql-transactions': sub('sub-sql-transactions', 'Transactions / ACID', 'top-sql-advanced', 'cat-sql', 5,  2),
  'sub-sql-stored-procs': sub('sub-sql-stored-procs', 'Stored Procedures',   'top-sql-advanced', 'cat-sql', 4,  1),

  // ── Statistics
  'sub-descriptive':          sub('sub-descriptive',          'Descriptive Statistics',   'top-statistics', 'cat-stats', 5, 2),
  'sub-distributions':        sub('sub-distributions',        'Probability Distributions','top-statistics', 'cat-stats', 6, 2),
  'sub-hypothesis':           sub('sub-hypothesis',           'Hypothesis Testing',        'top-statistics', 'cat-stats', 8, 3),
  'sub-confidence-intervals': sub('sub-confidence-intervals', 'Confidence Intervals',      'top-statistics', 'cat-stats', 6, 2),
  'sub-regression-stats':     sub('sub-regression-stats',     'Regression Analysis',       'top-statistics', 'cat-stats', 6, 2),
  'sub-anova':                sub('sub-anova',                'ANOVA',                     'top-statistics', 'cat-stats', 4, 1),

  // ── Probability
  'sub-prob-theory':    sub('sub-prob-theory',    'Probability Theory',    'top-probability', 'cat-stats', 6, 2),
  'sub-bayes':          sub('sub-bayes',          'Bayes Theorem',         'top-probability', 'cat-stats', 6, 3),
  'sub-combinatorics':  sub('sub-combinatorics',  'Combinatorics',         'top-probability', 'cat-stats', 6, 2),
  'sub-random-variables':sub('sub-random-variables','Random Variables',    'top-probability', 'cat-stats', 5, 2),

  // ── EDA
  'sub-eda-basics':       sub('sub-eda-basics',       'EDA Fundamentals',     'top-eda', 'cat-data-science', 5, 2),
  'sub-data-cleaning':    sub('sub-data-cleaning',    'Data Cleaning',         'top-eda', 'cat-data-science', 6, 2),
  'sub-pandas-profiling': sub('sub-pandas-profiling', 'Pandas Profiling',      'top-eda', 'cat-data-science', 5, 2),
  'sub-visualization':    sub('sub-visualization',    'Data Visualization',    'top-eda', 'cat-data-science', 6, 2),
  'sub-outlier-detection':sub('sub-outlier-detection','Outlier Detection',     'top-eda', 'cat-data-science', 4, 1),

  // ── Feature Engineering
  'sub-feature-selection': sub('sub-feature-selection', 'Feature Selection', 'top-feature-eng', 'cat-data-science', 6, 2),
  'sub-encoding':          sub('sub-encoding',          'Encoding',          'top-feature-eng', 'cat-data-science', 5, 2),
  'sub-scaling':           sub('sub-scaling',           'Scaling / Normalization', 'top-feature-eng', 'cat-data-science', 5, 2),
  'sub-feature-creation':  sub('sub-feature-creation',  'Feature Creation',  'top-feature-eng', 'cat-data-science', 5, 1),

  // ── Supervised ML
  'sub-linear-reg':       sub('sub-linear-reg',       'Linear Regression',     'top-supervised', 'cat-ml', 8,  3),
  'sub-logistic-reg':     sub('sub-logistic-reg',     'Logistic Regression',   'top-supervised', 'cat-ml', 8,  3),
  'sub-decision-tree':    sub('sub-decision-tree',    'Decision Trees',        'top-supervised', 'cat-ml', 6,  2),
  'sub-random-forest':    sub('sub-random-forest',    'Random Forest',         'top-supervised', 'cat-ml', 6,  2),
  'sub-svm':              sub('sub-svm',              'SVM',                   'top-supervised', 'cat-ml', 6,  2),
  'sub-knn':              sub('sub-knn',              'KNN',                   'top-supervised', 'cat-ml', 5,  1),
  'sub-naive-bayes':      sub('sub-naive-bayes',      'Naive Bayes',           'top-supervised', 'cat-ml', 5,  1),
  'sub-gradient-boosting':sub('sub-gradient-boosting','Gradient Boosting / XGBoost', 'top-supervised', 'cat-ml', 8, 3),

  // ── Unsupervised ML
  'sub-kmeans':       sub('sub-kmeans',       'K-Means Clustering', 'top-unsupervised', 'cat-ml', 6, 2),
  'sub-hierarchical': sub('sub-hierarchical', 'Hierarchical Clustering', 'top-unsupervised', 'cat-ml', 4, 1),
  'sub-pca':          sub('sub-pca',          'PCA',                'top-unsupervised', 'cat-ml', 8, 3),
  'sub-dbscan':       sub('sub-dbscan',       'DBSCAN',             'top-unsupervised', 'cat-ml', 4, 1),

  // ── Model Evaluation
  'sub-cross-validation':     sub('sub-cross-validation',     'Cross-Validation',       'top-model-eval', 'cat-ml', 6, 2),
  'sub-metrics':              sub('sub-metrics',              'Evaluation Metrics',      'top-model-eval', 'cat-ml', 8, 3),
  'sub-bias-variance':        sub('sub-bias-variance',        'Bias-Variance Tradeoff', 'top-model-eval', 'cat-ml', 6, 2),
  'sub-hyperparameter-tuning':sub('sub-hyperparameter-tuning','Hyperparameter Tuning',   'top-model-eval', 'cat-ml', 5, 2),
  'sub-confusion-matrix':     sub('sub-confusion-matrix',     'Confusion Matrix / ROC', 'top-model-eval', 'cat-ml', 5, 2),

  // ── DBMS
  'sub-normalization':    sub('sub-normalization',    'Normalization (1NF-3NF)', 'top-dbms', 'cat-cs-fundamentals', 6, 2),
  'sub-transactions':     sub('sub-transactions',     'Transactions & ACID',     'top-dbms', 'cat-cs-fundamentals', 5, 2),
  'sub-keys-constraints': sub('sub-keys-constraints', 'Keys & Constraints',      'top-dbms', 'cat-cs-fundamentals', 5, 2),
  'sub-er-model':         sub('sub-er-model',         'ER Model',                'top-dbms', 'cat-cs-fundamentals', 4, 1),

  // ── OOP
  'sub-inheritance':    sub('sub-inheritance',    'Inheritance',      'top-oop', 'cat-cs-fundamentals', 5, 2),
  'sub-polymorphism':   sub('sub-polymorphism',   'Polymorphism',     'top-oop', 'cat-cs-fundamentals', 5, 2),
  'sub-encapsulation':  sub('sub-encapsulation',  'Encapsulation & Abstraction', 'top-oop', 'cat-cs-fundamentals', 4, 1),
  'sub-design-patterns':sub('sub-design-patterns','Design Patterns',  'top-oop', 'cat-cs-fundamentals', 6, 2),

  // ── OS
  'sub-processes':    sub('sub-processes',    'Processes & Threads', 'top-os', 'cat-cs-fundamentals', 6, 2),
  'sub-scheduling':   sub('sub-scheduling',   'CPU Scheduling',      'top-os', 'cat-cs-fundamentals', 5, 2),
  'sub-memory':       sub('sub-memory',       'Memory Management',   'top-os', 'cat-cs-fundamentals', 5, 2),
  'sub-deadlocks':    sub('sub-deadlocks',    'Deadlocks',           'top-os', 'cat-cs-fundamentals', 4, 1),
  'sub-file-systems': sub('sub-file-systems', 'File Systems',        'top-os', 'cat-cs-fundamentals', 4, 1),

  // ── Networks
  'sub-osi':     sub('sub-osi',     'OSI Model',    'top-networks', 'cat-cs-fundamentals', 5, 2),
  'sub-tcp-ip':  sub('sub-tcp-ip',  'TCP/IP',       'top-networks', 'cat-cs-fundamentals', 6, 2),
  'sub-http':    sub('sub-http',    'HTTP/HTTPS',   'top-networks', 'cat-cs-fundamentals', 5, 2),
  'sub-dns':     sub('sub-dns',     'DNS',          'top-networks', 'cat-cs-fundamentals', 4, 1),
  'sub-sockets': sub('sub-sockets', 'Sockets',      'top-networks', 'cat-cs-fundamentals', 4, 1),

  // ── Quantitative Aptitude
  'sub-number-theory': sub('sub-number-theory', 'Number Theory',         'top-quant', 'cat-aptitude-se', 5, 2),
  'sub-speed-distance':sub('sub-speed-distance','Speed, Distance & Time','top-quant', 'cat-aptitude-se', 5, 1),
  'sub-permutations':  sub('sub-permutations',  'Permutations & Combinations', 'top-quant', 'cat-aptitude-se', 6, 2),
  'sub-profit-loss':   sub('sub-profit-loss',   'Profit & Loss',         'top-quant', 'cat-aptitude-se', 4, 1),

  // ── Logical Reasoning
  'sub-syllogisms':    sub('sub-syllogisms',    'Syllogisms',      'top-logical', 'cat-aptitude-se', 5, 2),
  'sub-blood-relations':sub('sub-blood-relations','Blood Relations','top-logical', 'cat-aptitude-se', 4, 1),
  'sub-puzzles':       sub('sub-puzzles',       'Puzzles',         'top-logical', 'cat-aptitude-se', 5, 2),
  'sub-seating':       sub('sub-seating',       'Seating Arrangements', 'top-logical', 'cat-aptitude-se', 4, 1),

  // ── Algorithm Complexity
  'sub-time-complexity':  sub('sub-time-complexity',  'Time Complexity',   'top-complexity', 'cat-aptitude-se', 8, 3),
  'sub-space-complexity': sub('sub-space-complexity', 'Space Complexity',  'top-complexity', 'cat-aptitude-se', 6, 2),
  'sub-amortized':        sub('sub-amortized',        'Amortized Analysis','top-complexity', 'cat-aptitude-se', 5, 2),

  // ── Software Engineering
  'sub-git':           sub('sub-git',           'Git & GitHub',      'top-se', 'cat-aptitude-se', 5, 2),
  'sub-apis-rest':     sub('sub-apis-rest',     'APIs & REST',       'top-se', 'cat-aptitude-se', 6, 2),
  'sub-docker':        sub('sub-docker',        'Docker & Containers','top-se', 'cat-aptitude-se', 5, 2),
  'sub-solid-principles':sub('sub-solid-principles','SOLID Principles','top-se', 'cat-aptitude-se', 5, 2),
}

const categoryOrder: string[] = [
  'cat-programming',
  'cat-dsa',
  'cat-sql',
  'cat-stats',
  'cat-data-science',
  'cat-ml',
  'cat-cs-fundamentals',
  'cat-aptitude-se',
]

export const SEED_CURRICULUM: Pick<AppState, 'categories' | 'topics' | 'subtopics' | 'categoryOrder'> = {
  categories,
  topics,
  subtopics,
  categoryOrder,
}
