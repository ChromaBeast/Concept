import '../../models/models.dart';

final List<Concept> seedConceptsOsNetworking = [
  Concept(
    id: 'concept-tcp-handshake',
    slug: 'tcp-3-way-handshake',
    title: 'TCP 3-Way Handshake',
    oneLiner: 'Transport layer connection establishment protocol ensuring synchronized sequence numbers.',
    category: Category.networking,
    difficulty: Difficulty.beginner,
    tagIds: const ['tag-tcp-ip', 'tag-networking', 'tag-reliability'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 85,
    askedByCompanies: const ['Cisco', 'Cloudflare', 'Google', 'Amazon'],
    relatedConceptIds: const ['concept-epoll'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'The process of establishing a reliable bidirectional TCP connection through three packets: SYN, SYN-ACK, and ACK.',
      whyItMatters:
          'Establishes initial sequence numbers (ISNs) and buffer parameters, ensuring ordered, reliable packet delivery over unreliable IP networks.',
      example:
          '1. Client -> SYN (seq=x)\n2. Server -> SYN-ACK (seq=y, ack=x+1)\n3. Client -> ACK (seq=x+1, ack=y+1)\nConnection ESTABLISHED.',
      commonPitfall:
          'SYN flood attacks consuming server half-open connection queues. Mitigated with SYN Cookies.',
      interviewAngle:
          'Explain why 2 packets are insufficient for reliable duplex sequence synchronization.',
      quickChecks: [
        QuickCheck(
          question: 'What are the 3 steps in the TCP handshake?',
          answer: 'SYN, SYN-ACK, and ACK.',
        ),
        QuickCheck(
          question: 'What defense protects servers from SYN Flood DDoS attacks?',
          answer: 'SYN Cookies, which avoid allocating state in the half-open queue.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-virtual-memory',
    slug: 'virtual-memory-paging',
    title: 'Virtual Memory & Paging',
    oneLiner: 'OS memory management abstraction giving each process isolated, contiguous address spaces.',
    category: Category.operatingSystems,
    difficulty: Difficulty.intermediate,
    tagIds: const ['tag-os', 'tag-reliability'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 90,
    askedByCompanies: const ['Apple', 'Microsoft', 'NVIDIA'],
    relatedConceptIds: const ['concept-concurrency-parallelism'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'An OS architecture mapping virtual addresses used by processes to physical RAM addresses (or disk swap) using page tables and the MMU.',
      whyItMatters:
          'Provides strict process memory isolation, protects kernel space from user crashes, and allows processes to exceed physical RAM capacity.',
      example:
          'When a process reads a page not in RAM, the MMU triggers a Page Fault. The OS kernel retrieves the page from swap disk into RAM.',
      commonPitfall:
          'Memory thrashing: when excessive swapping between RAM and disk saturates the I/O bus, freezing the operating system.',
      interviewAngle:
          'Explain the role of the TLB (Translation Lookaside Buffer) in caching page table translations.',
      quickChecks: [
        QuickCheck(
          question: 'What hardware component translates virtual addresses to physical addresses?',
          answer: 'The Memory Management Unit (MMU) assisted by the TLB cache.',
        ),
        QuickCheck(
          question: 'What occurs when a requested page is not currently in physical RAM?',
          answer: 'A Page Fault trap occurs, prompting the OS to page it in from disk swap.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-concurrency-parallelism',
    slug: 'concurrency-vs-parallelism',
    title: 'Concurrency vs Parallelism',
    oneLiner: 'Concurrency is dealing with lots of things at once; parallelism is doing lots of things at once.',
    category: Category.operatingSystems,
    difficulty: Difficulty.beginner,
    tagIds: const ['tag-concurrency', 'tag-os', 'tag-async-io'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 80,
    askedByCompanies: const ['Go/Rust Core Teams', 'Google', 'Meta'],
    relatedConceptIds: const ['concept-epoll'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'Concurrency is the composition of independently executing processes (structure). Parallelism is the simultaneous execution of multiple computations on multiple CPU cores.',
      whyItMatters:
          'Concurrency enables responsive asynchronous I/O and UI loops even on 1 core. Parallelism speeds up CPU-intensive batch computation across cores.',
      example:
          'Single-core event loop juggling 10k web sockets is concurrent. Four CPU cores executing matrix multiplication is parallel.',
      commonPitfall:
          'Assuming adding threads automatically makes code faster; thread context switching on a single core adds overhead.',
      interviewAngle:
          'Clarify whether a system bottleneck is I/O-bound (concurrency) or CPU-bound (parallelism).',
      quickChecks: [
        QuickCheck(
          question: 'Can you have concurrency on a single-core CPU?',
          answer: 'Yes, via time-slicing or an event loop interleaving tasks.',
        ),
        QuickCheck(
          question: 'What hardware is strictly required for true parallelism?',
          answer: 'Multiple physical CPU cores or execution units.',
        ),
      ],
    ),
  ),
  Concept(
    id: 'concept-epoll',
    slug: 'epoll-io-multiplexing',
    title: 'Epoll & I/O Multiplexing',
    oneLiner: 'Scalable Linux I/O event notification mechanism handling 100k+ concurrent network sockets in O(1) time.',
    category: Category.operatingSystems,
    difficulty: Difficulty.advanced,
    tagIds: const ['tag-async-io', 'tag-networking', 'tag-os'],
    status: ContentStatus.published,
    source: ContentSource.humanCurated,
    estimatedReadSeconds: 95,
    askedByCompanies: const ['Nginx', 'Redis', 'Cloudflare'],
    relatedConceptIds: const ['concept-tcp-handshake', 'concept-concurrency-parallelism'],
    createdAt: DateTime(2026, 1, 1),
    updatedAt: DateTime(2026, 1, 1),
    body: const ConceptBody(
      definition:
          'A Linux kernel system call interface monitoring multiple file descriptors to see if I/O is possible, operating in O(1) event-driven time.',
      whyItMatters:
          'Overcomes the C10K problem of `select`/`poll` (which took O(N) to scan all fds), powering ultra-fast servers like NGINX, Node.js, and Redis.',
      example:
          'int epfd = epoll_create1(0);\nepoll_ctl(epfd, EPOLL_CTL_ADD, sock_fd, &ev);\nint nfds = epoll_wait(epfd, events, MAX_EVENTS, -1);',
      commonPitfall:
          'Starvation in Edge-Triggered (ET) mode if socket buffers are not read to completion (`EAGAIN`) in a non-blocking loop.',
      interviewAngle:
          'Explain the difference between Level-Triggered (LT) and Edge-Triggered (ET) notification modes.',
      quickChecks: [
        QuickCheck(
          question: 'Why does epoll scale better than select() with 100,000 connections?',
          answer: 'epoll returns only active descriptors in O(1), avoiding O(N) full array scans.',
        ),
        QuickCheck(
          question: 'What design pattern does epoll enable in high performance servers?',
          answer: 'The Reactor pattern / single-threaded non-blocking event loop.',
        ),
      ],
    ),
  ),
];
