import '../../models/models.dart';

final List<Concept> seedConceptsSystemDesign = [
  Concept(
    id: 'concept-cap-theorem',
    slug: 'cap-theorem',
    title: 'CAP Theorem',
    oneLiner: 'Distributed systems trade-off between Consistency, Availability, and Partition Tolerance.',
    category: Category.systemDesign,
    difficulty: Difficulty.intermediate,
    tagIds: const ['tag-cap-theorem', 'tag-distributed-systems', 'tag-scalability'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 90,
    askedByCompanies: const ['Amazon', 'Google', 'Meta', 'Uber'],
    relatedConceptIds: const ['concept-consistent-hashing', 'concept-database-sharding'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'States that a distributed data store can provide at most two out of three guarantees: Consistency, Availability, and Partition Tolerance.',
      whyItMatters:
          'Since network partitions are inevitable in real-world distributed networks, engineers must explicitly choose between CP (consistent) and AP (available).',
      example:
          'RDBMS (CP like Spanner/Postgres multi-region) rejects writes during partition to prevent split-brain. Cassandra (AP) accepts writes everywhere and reconciles later.',
      commonPitfall:
          'Believing you can pick CA in distributed networks. Network drops will happen; P is non-negotiable.',
      interviewAngle:
          'Clarify system requirements (e.g. banking CP vs social feed AP) during architecture design.',
      quickChecks: [
        QuickCheck(
          question: 'Why is CA not achievable in real distributed networks?',
          answer: 'Because network partitions cannot be prevented in physical infrastructure.',
        ),
        QuickCheck(
          question: 'What does an AP system prioritize during network partition?',
          answer: 'Availability: continuing to serve reads and writes with eventual consistency.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-consistent-hashing',
    slug: 'consistent-hashing',
    title: 'Consistent Hashing',
    oneLiner: 'Distributed hashing technique minimizing key remapping when cluster nodes are added or removed.',
    category: Category.systemDesign,
    difficulty: Difficulty.advanced,
    tagIds: const ['tag-distributed-systems', 'tag-scalability', 'tag-caching'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 95,
    askedByCompanies: const ['Amazon', 'Discord', 'Meta'],
    relatedConceptIds: const ['concept-cap-theorem', 'concept-database-sharding'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'A hashing scheme where both servers and keys map onto a virtual 360° ring. Keys route clockwise to the first available server node.',
      whyItMatters:
          'When scaling from N to N+1 nodes, only k/N keys need relocation instead of remapping nearly 100% of keys with traditional modulo hashing.',
      example:
          'DynamoDB, Cassandra, and Memcached use virtual nodes (vnodes) on hash rings to balance load evenly across heterogeneous servers.',
      commonPitfall:
          'Not using virtual nodes per physical machine, which results in non-uniform key distribution (hotspots).',
      interviewAngle:
          'Explain how virtual nodes resolve load skew on the consistent hash ring.',
      quickChecks: [
        QuickCheck(
          question: 'What fraction of keys are remapped when a node is added in consistent hashing?',
          answer: 'Approximately K/N keys (where K is total keys, N is number of servers).',
        ),
        QuickCheck(
          question: 'How do virtual nodes prevent hotspot skew?',
          answer: 'By distributing each physical machine across multiple positions on the ring.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-rate-limiting',
    slug: 'rate-limiting',
    title: 'Token Bucket Rate Limiting',
    oneLiner: 'Algorithm controlling traffic rate and burst capacity for high-throughput APIs.',
    category: Category.systemDesign,
    difficulty: Difficulty.intermediate,
    tagIds: const ['tag-rate-limiting', 'tag-scalability', 'tag-distributed-systems'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 85,
    askedByCompanies: const ['Stripe', 'Cloudflare', 'GitHub'],
    relatedConceptIds: const ['concept-consistent-hashing'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'Tokens are added to a bucket at a fixed rate up to max capacity. Each request consumes tokens; if empty, requests are rejected with HTTP 429.',
      whyItMatters:
          'Protects backend infrastructure from denial of service (DoS), cascading failures, and noisy neighbor tenant overconsumption.',
      example:
          'Redis-backed token bucket: Store {tokens, lastRefillTimestamp}. On request, calculate added tokens based on elapsed time, deduct 1 if >= 1.',
      commonPitfall:
          'Using naive in-memory rate limiting behind a load balancer without a distributed store like Redis.',
      interviewAngle:
          'Compare Token Bucket (allows controlled bursts) vs Leaky Bucket (smooth constant output rate).',
      quickChecks: [
        QuickCheck(
          question: 'What HTTP status code is standard for rate limited responses?',
          answer: 'HTTP 429 Too Many Requests.',
        ),
        QuickCheck(
          question: 'Why is Token Bucket favored over Fixed Window?',
          answer: 'It handles traffic bursts gracefully without boundary reset spikes.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-database-sharding',
    slug: 'database-sharding',
    title: 'Database Sharding',
    oneLiner: 'Horizontal database partitioning distributing rows across distinct server instances.',
    category: Category.systemDesign,
    difficulty: Difficulty.advanced,
    tagIds: const ['tag-databases', 'tag-scalability', 'tag-distributed-systems'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 90,
    askedByCompanies: const ['Uber', 'Slack', 'Meta'],
    relatedConceptIds: const ['concept-consistent-hashing', 'concept-cap-theorem'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'Splitting a massive database table horizontally into smaller partitions (shards) across distinct physical database servers by a shard key.',
      whyItMatters:
          'Overcomes single-node disk, CPU, and connection limits, scaling read and write throughput linearly.',
      example:
          'Sharding by `tenant_id` or `user_id % 16`. All user data resides on that shard, eliminating distributed transactions for single-user operations.',
      commonPitfall:
          'Choosing a bad shard key (e.g. timestamp or low cardinality field) creating severe hotspot shards.',
      interviewAngle:
          'Discuss the trade-offs of cross-shard joins and distributed two-phase commit transactions.',
      quickChecks: [
        QuickCheck(
          question: 'What is horizontal partitioning compared to vertical partitioning?',
          answer: 'Horizontal partitions rows across shards; vertical partitions columns/tables.',
        ),
        QuickCheck(
          question: 'What is a major challenge introduced by database sharding?',
          answer: 'Executing cross-shard joins and distributed ACID transactions.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-event-sourcing',
    slug: 'event-sourcing',
    title: 'Event Sourcing',
    oneLiner: 'Architectural pattern persisting all state changes as an append-only log of immutable events.',
    category: Category.systemDesign,
    difficulty: Difficulty.advanced,
    tagIds: const ['tag-event-sourcing', 'tag-distributed-systems', 'tag-databases'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 90,
    askedByCompanies: const ['Stripe', 'Netflix', 'Shopify'],
    relatedConceptIds: const ['concept-database-sharding'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'Storing the complete history of domain state changes as an immutable sequence of events rather than overwriting current state.',
      whyItMatters:
          'Provides complete 100% auditability, historical time-travel debugging, and painless projection rebuilding for CQRS read models.',
      example:
          'Banking ledger: Instead of storing `balance: \$100`, store `[Deposited \$150, Withdrew \$50]`. The current balance is derived by replaying events.',
      commonPitfall:
          'Replaying millions of events from inception on every read without creating periodic state snapshots.',
      interviewAngle:
          'Explain CQRS (Command Query Responsibility Segregation) pairing with Event Sourcing.',
      quickChecks: [
        QuickCheck(
          question: 'Can events in an Event Sourcing store be updated or deleted?',
          answer: 'No, the event store is strictly append-only and immutable.',
        ),
        QuickCheck(
          question: 'How do you optimize state reconstruction for long event streams?',
          answer: 'By storing periodic snapshots and only replaying subsequent events.',
        ),
      ],
    ),
  ),
];
