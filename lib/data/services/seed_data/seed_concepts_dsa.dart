import '../../models/models.dart';

final List<Concept> seedConceptsDsa = [
  Concept(
    id: 'concept-binary-search',
    slug: 'binary-search',
    title: 'Binary Search',
    oneLiner: 'Divide-and-conquer search algorithm operating on sorted collections in O(log n) time.',
    category: Category.dsa,
    difficulty: Difficulty.beginner,
    tagIds: const ['tag-binary-search', 'tag-algorithms', 'tag-data-structures'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 80,
    askedByCompanies: const ['Google', 'Meta', 'Amazon', 'Microsoft'],
    relatedConceptIds: const ['concept-trie'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'An algorithm that finds the target position in a sorted array by repeatedly comparing the target to the middle element and halving search space.',
      whyItMatters:
          'Reduces search time from linear O(n) to logarithmic O(log n). For 1 billion items, it finds answers in only 30 comparisons.',
      example:
          'int l = 0, r = nums.length - 1;\nwhile (l <= r) {\n  int m = l + (r - l) ~/ 2;\n  if (nums[m] == target) return m;\n  if (nums[m] < target) l = m + 1; else r = m - 1;\n}',
      commonPitfall:
          'Calculating mid with (low + high) / 2 causes integer overflow in fixed-width arithmetic. Use low + (high - low) / 2 instead.',
      interviewAngle:
          'Watch for boundary conditions (<= vs <) and rotated sorted arrays.',
      quickChecks: [
        QuickCheck(
          question: 'What is the prerequisite for standard binary search?',
          answer: 'The collection or search space must be monotonic or sorted.',
        ),
        QuickCheck(
          question: 'What is the time complexity of binary search?',
          answer: 'O(log n) time complexity.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-lru-cache',
    slug: 'lru-cache',
    title: 'LRU Cache',
    oneLiner: 'Fixed-capacity cache evicting the least recently accessed items first in O(1) time.',
    category: Category.dsa,
    difficulty: Difficulty.intermediate,
    tagIds: const ['tag-caching', 'tag-data-structures', 'tag-algorithms'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 90,
    askedByCompanies: const ['Amazon', 'Meta', 'Apple', 'Uber'],
    relatedConceptIds: const ['concept-binary-search'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'A cache data structure that evicts the least recently accessed item when full, achieving O(1) get and put operations.',
      whyItMatters:
          'Crucial for memory management, database buffer pools, and web application caching where working memory is limited.',
      example:
          'Combine a Hash Map (for O(1) key lookup) with a Doubly Linked List (for O(1) node relocation to head on access and tail eviction on full capacity).',
      commonPitfall:
          'Forgetting to update node order on read (get) operations, not just write (put) operations.',
      interviewAngle:
          'Explain why hash map + doubly linked list achieves O(1) for all ops.',
      quickChecks: [
        QuickCheck(
          question: 'Which two data structures implement an O(1) LRU Cache?',
          answer: 'A Hash Map and a Doubly Linked List.',
        ),
        QuickCheck(
          question: 'Does accessing an existing item count as a recent access?',
          answer: 'Yes, reading moves the item to the most recently used head position.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-graph-bfs-dfs',
    slug: 'graph-bfs-dfs',
    title: 'Graph Traversal: BFS vs DFS',
    oneLiner: 'Breadth-First and Depth-First algorithms for exploring nodes and edges in graph networks.',
    category: Category.dsa,
    difficulty: Difficulty.intermediate,
    tagIds: const ['tag-graphs', 'tag-algorithms', 'tag-data-structures'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 90,
    askedByCompanies: const ['Google', 'Bloomberg', 'Netflix'],
    relatedConceptIds: const ['concept-trie'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'BFS explores neighbor nodes layer-by-layer using a Queue. DFS explores deep along each branch before backtracking using a Stack or recursion.',
      whyItMatters:
          'BFS guarantees the shortest path on unweighted graphs. DFS is ideal for topological sort, cycle detection, and maze exploration.',
      example:
          'BFS: Queue<Node> q = [root]; while(q.isNotEmpty) { var n = q.removeFirst(); for(var v in n.neighbors) if(!seen(v)) q.add(v); }',
      commonPitfall:
          'Failing to track visited nodes, leading to infinite loops in cyclic graphs.',
      interviewAngle:
          'Know when to choose BFS (shortest unweighted path) vs DFS (backtracking, connected components).',
      quickChecks: [
        QuickCheck(
          question: 'Which traversal algorithm finds the shortest path on unweighted graphs?',
          answer: 'Breadth-First Search (BFS).',
        ),
        QuickCheck(
          question: 'What data structure powers BFS exploration?',
          answer: 'A FIFO Queue.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-trie',
    slug: 'trie-prefix-tree',
    title: 'Trie (Prefix Tree)',
    oneLiner: 'Tree data structure for fast prefix-based string search and autocomplete engines.',
    category: Category.dsa,
    difficulty: Difficulty.intermediate,
    tagIds: const ['tag-trees', 'tag-data-structures', 'tag-algorithms'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 85,
    askedByCompanies: const ['Google', 'Microsoft', 'Uber'],
    relatedConceptIds: const ['concept-binary-search'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'A tree-like data structure where each node represents a character, allowing strings sharing common prefixes to share tree branches.',
      whyItMatters:
          'Enables O(L) search, insert, and prefix matching where L is word length, completely independent of total stored dictionary size.',
      example:
          'class TrieNode {\n  final Map<String, TrieNode> children = {};\n  bool isEndOfWord = false;\n}',
      commonPitfall:
          'High memory overhead when using fixed-size arrays per node if character sets are large or sparse.',
      interviewAngle:
          'Discuss space-time tradeoffs between Tries and Hash Tables for autocomplete.',
      quickChecks: [
        QuickCheck(
          question: 'What is the search time complexity for a word of length L in a Trie?',
          answer: 'O(L), proportional only to word length.',
        ),
        QuickCheck(
          question: 'What is a primary use case of a Trie in production apps?',
          answer: 'Search autocomplete, spell checking, and IP routing tables.',
        ),
      ],
    ),
  ),
];
