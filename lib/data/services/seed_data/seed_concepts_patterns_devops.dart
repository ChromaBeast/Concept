import '../../models/models.dart';

final List<Concept> seedConceptsPatternsDevops = [
  Concept(
    id: 'concept-dependency-injection',
    slug: 'dependency-injection',
    title: 'Dependency Injection',
    oneLiner: 'Design pattern supplying required dependencies from the outside rather than instantiating them internally.',
    category: Category.oopDesignPatterns,
    difficulty: Difficulty.beginner,
    tagIds: const ['tag-design-patterns', 'tag-reliability'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 80,
    askedByCompanies: const ['Google', 'Microsoft', 'Uber'],
    relatedConceptIds: const ['concept-circuit-breaker'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'A technique where an object receives its dependencies from an external assembler (inversion of control) rather than hardcoding their creation.',
      whyItMatters:
          'Decouples components, makes code modular, and allows effortless mocking of services for isolated unit testing.',
      example:
          '// Good: Injected\nclass UserService {\n  final UserRepository repo;\n  UserService(this.repo);\n}',
      commonPitfall:
          'Overusing service locators or complex reflection DI containers where simple constructor injection suffices.',
      interviewAngle:
          'Discuss how Dependency Inversion Principle (DIP in SOLID) relates to Dependency Injection.',
      quickChecks: [
        QuickCheck(
          question: 'What is the primary benefit of dependency injection in automated testing?',
          answer: 'Allows swapping concrete network/database implementations with mock objects.',
        ),
        QuickCheck(
          question: 'What principle of SOLID does DI directly support?',
          answer: 'The Dependency Inversion Principle.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-circuit-breaker',
    slug: 'circuit-breaker-pattern',
    title: 'Circuit Breaker Pattern',
    oneLiner: 'Resilience pattern preventing cascading service failures by failing fast when downstream services are unhealthy.',
    category: Category.backend,
    difficulty: Difficulty.intermediate,
    tagIds: const ['tag-reliability', 'tag-design-patterns', 'tag-distributed-systems'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 90,
    askedByCompanies: const ['Netflix', 'Amazon', 'Stripe'],
    relatedConceptIds: const ['concept-idempotency'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'A design pattern wrapping calls to downstream services with 3 states: Closed (normal), Open (failing fast without calling), and Half-Open (trial testing).',
      whyItMatters:
          'Prevents server thread pool exhaustion and cascading distributed outages when a third-party dependency is down.',
      example:
          'When payment gateway fails 50% of requests over 10s, Circuit trips to Open for 30s, instantly returning fallback responses without queuing calls.',
      commonPitfall:
          'Not providing a sensible fallback response or fallback cache when the circuit is in Open state.',
      interviewAngle:
          'Walk through the transition triggers between Closed, Open, and Half-Open states.',
      quickChecks: [
        QuickCheck(
          question: 'What are the 3 states of a Circuit Breaker?',
          answer: 'Closed (healthy), Open (fail fast), and Half-Open (probe recovery).',
        ),
        QuickCheck(
          question: 'What resource does a circuit breaker prevent exhausting?',
          answer: 'Thread pools, connection pools, and client sockets.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-idempotency',
    slug: 'api-idempotency',
    title: 'API Idempotency',
    oneLiner: 'Property of an API endpoint where making the same request multiple times produces the exact same outcome.',
    category: Category.backend,
    difficulty: Difficulty.intermediate,
    tagIds: const ['tag-api-design', 'tag-reliability'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 85,
    askedByCompanies: const ['Stripe', 'PayPal', 'Shopify'],
    relatedConceptIds: const ['concept-circuit-breaker'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'An operation is idempotent if executing it once or multiple identical times has the same intended effect and leaves system state unchanged.',
      whyItMatters:
          'Essential in payment processing and distributed retries so that network timeouts do not cause duplicate credit card charges.',
      example:
          'Client sends header `Idempotency-Key: req_123abc`. Server records key in atomic store; repeat requests return cached initial response.',
      commonPitfall:
          'Assuming HTTP POST is naturally idempotent. POST requires explicit idempotency keys; GET/PUT/DELETE are naturally idempotent.',
      interviewAngle:
          'Design an idempotent charge API handling concurrent identical requests and database locks.',
      quickChecks: [
        QuickCheck(
          question: 'Which HTTP methods are naturally idempotent by RFC specification?',
          answer: 'GET, PUT, DELETE, and HEAD.',
        ),
        QuickCheck(
          question: 'How do modern payment APIs guarantee idempotency on POST requests?',
          answer: 'By requiring unique client-generated Idempotency Keys.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-zero-downtime',
    slug: 'zero-downtime-deployment',
    title: 'Zero-Downtime Deployment',
    oneLiner: 'Release strategies updating production software without interrupting user traffic or dropping requests.',
    category: Category.devopsInfra,
    difficulty: Difficulty.intermediate,
    tagIds: const ['tag-devops', 'tag-ci-cd', 'tag-reliability'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 90,
    askedByCompanies: const ['Netflix', 'AWS', 'Spotify'],
    relatedConceptIds: const ['concept-circuit-breaker'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'Deployment methodologies (Blue-Green, Canary, Rolling) that release new versions while active instances continuously serve live user traffic.',
      whyItMatters:
          'Eliminates maintenance windows, maximizes uptime SLAs, and allows continuous deployment multiple times per day with safe rollback.',
      example:
          'Blue-Green: Blue (v1) receives 100% traffic. Green (v2) is deployed and health-checked. Router switches load balancer target to Green in 1 second.',
      commonPitfall:
          'Making backwards-incompatible database schema changes (e.g. dropping columns) before rolling out application code.',
      interviewAngle:
          'Explain the Expand and Contract pattern for zero-downtime database migrations.',
      quickChecks: [
        QuickCheck(
          question: 'What is Blue-Green deployment?',
          answer: 'Running two identical production environments and switching traffic via load balancer.',
        ),
        QuickCheck(
          question: 'How do you safely migrate database columns without downtime?',
          answer: 'Use Expand & Contract: add new column, dual write, backfill, switch reads, drop old column.',
        ),
      ],
    ),
  ),
];
