const TOPICS = [
  { topic: 'LRU Cache Architecture', category: 'dsa', difficulty: 'intermediate' },
  { topic: 'CAP Theorem & Trade-offs', category: 'system_design', difficulty: 'beginner' },
  { topic: 'Consistent Hashing & Ring Distribution', category: 'system_design', difficulty: 'intermediate' },
  { topic: 'Rate Limiting (Token & Leaky Bucket)', category: 'system_design', difficulty: 'intermediate' },
  { topic: 'Database Sharding & Partitioning', category: 'databases', difficulty: 'advanced' },
  { topic: 'Event Sourcing Architecture', category: 'system_design', difficulty: 'advanced' },
  { topic: 'ACID Properties & Transaction Guarantees', category: 'databases', difficulty: 'beginner' },
  { topic: 'B+ Tree Indexing & Query Execution', category: 'databases', difficulty: 'intermediate' },
  { topic: 'MVCC & Transaction Isolation Levels', category: 'databases', difficulty: 'advanced' },
  { topic: 'TCP 3-Way Handshake & Connection Teardown', category: 'networking', difficulty: 'beginner' },
  { topic: 'Process vs Thread Memory Model', category: 'operating_systems', difficulty: 'beginner' },
  { topic: 'Virtual Memory & Page Fault Handling', category: 'operating_systems', difficulty: 'intermediate' },
  { topic: 'Epoll & I/O Multiplexing Mechanics', category: 'operating_systems', difficulty: 'advanced' },
  { topic: 'Circuit Breaker Resilience Pattern', category: 'oop_design_patterns', difficulty: 'intermediate' },
  { topic: 'Dependency Injection & Inversion of Control', category: 'oop_design_patterns', difficulty: 'beginner' },
  { topic: 'Zero-Downtime Blue-Green Deployment', category: 'devops_infra', difficulty: 'intermediate' },
  { topic: 'Browser Event Loop & Microtask Queue', category: 'frontend', difficulty: 'intermediate' },
  { topic: 'OAuth 2.0 & Proof Key for Code Exchange (PKCE)', category: 'security', difficulty: 'advanced' },
  { topic: 'Graph Traversal: BFS vs DFS Algorithms', category: 'dsa', difficulty: 'intermediate' },
  { topic: 'Trie (Prefix Tree) String Search', category: 'dsa', difficulty: 'intermediate' },
];

async function generateTopic(item, index, total) {
  console.log(`[${index + 1}/${total}] Triggering Cloud Function for "${item.topic}" (${item.category})...`);
  try {
    const res = await fetch('https://sgp.cloud.appwrite.io/v1/functions/conceptEngine/executions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': '6a97fc420033ed1fefd0',
      },
      body: JSON.stringify({
        async: true,
        body: JSON.stringify({
          action: 'generate',
          topic: item.topic,
          category: item.category,
          difficulty: item.difficulty,
        }),
      }),
    });

    const execution = await res.json();
    console.log(`  -> Execution ${execution.$id} queued (status: ${execution.status})`);
  } catch (err) {
    console.error(`  -> Error: ${err.message}`);
  }
}

async function main() {
  console.log(`🚀 Generating ${TOPICS.length} concepts one by one using Concept Unified Engine cloud function...\n`);
  for (let i = 0; i < TOPICS.length; i++) {
    await generateTopic(TOPICS[i], i, TOPICS.length);
    // Short pause between calls
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log('\n✨ All cloud function executions completed!');
}

main();
