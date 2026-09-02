# Concept Learning App — Product & Technical Specification

**Working title:** "Concepts" (placeholder — swap freely, nothing below depends on the name)
**Platform:** Flutter (iOS + Android, web optional later)
**Content engine:** mostly automated — Gemini generates and self-checks text via Appwrite Functions (Go runtime) running the roadmap → topic → generation → publish loop; hero images are generated manually through Google Flow and attached from a small in-app queue
**Core promise:** any real-world software engineering concept, explained in under 2 minutes.

---

## 1. Problem & Scope

Software devs accumulate huge blind spots — DSA terms, system design patterns, OS/networking basics, language-specific gotchas, "soft" interview concepts — because full resources (courses, long blog posts, textbooks) are too slow to consult in passing. This app is a **dense reference + daily learning loop**: one concept, one card, one idea, readable in the time it takes to wait for a build to finish.

**In scope for v1:** structured concept cards, category browsing, tag-based search, courses (curated ordered playlists of existing concept cards, not separate long-form content), AI-generated + automated-approval content, bookmarks, daily concept, dark/light theme.
**Explicitly out of scope for v1:** video content, live mock interviews, social/community features, monetization.

---

## 2. Content Model

This is the core of the app — get this right first, everything else is UI on top of it.

### 2.1 Concept object (the unit of content)

```dart
class Concept {
  final String id;
  final String slug;                 // url-safe, e.g. "cap-theorem"
  final String title;                // "CAP Theorem"
  final String oneLiner;             // ~12 words, shown in lists/search results
  final Category category;           // enum, see 2.2
  final List<String> tagIds;         // e.g. ["distributed-systems", "databases"]
  final Difficulty difficulty;       // beginner | intermediate | advanced
  final ConceptBody body;            // structured content, see 2.3
  final int estimatedReadSeconds;    // computed, target 90–120
  final ContentStatus status;        // draft | needs_review | published | flagged
  final ContentSource source;        // ai_generated | ai_generated_reviewed | human_authored
  final String? aiModel;             // e.g. "gemini-3.8-flash"
  final String? promptVersion;       // e.g. "v3" — lets you regenerate stale content later
  final List<String> relatedConceptIds;
  final List<String> askedByCompanies; // optional, e.g. ["Google","Amazon"] — nullable list
  final DateTime createdAt;
  final DateTime updatedAt;
  final int viewCount;
  final int bookmarkCount;
  final bool visualAid;                    // did this concept warrant a generated image?
  final String? heroImageUrl;              // Appwrite Storage file URL, placed mid-card (§5.2)
  final String? imagePrompt;               // prompt used — kept so an image can be regenerated
  final bool needsDeepDive;                // did this concept warrant an optional extended deep dive? (§2.4)
  final List<String>? needsReviewReasons;  // populated only when automated checks failed
}
```

### 2.2 Category enum (top-level taxonomy)

Flat top-level categories, cross-cut by tags (tags carry the actual granularity):

`dsa`, `system_design`, `databases`, `operating_systems`, `networking`, `oop_design_patterns`, `frontend`, `backend`, `devops_infra`, `security`, `testing_qa`, `version_control`, `cloud`, `ml_basics`, `behavioral_interview`, `language_specific` (with a `language` sub-field: dart, js, python, java, go, etc.)

### 2.3 ConceptBody — the structured content itself

Every card follows the **same core skeleton**, so the reader's eyes always know where to look. For dense topics requiring deeper exploration, an optional collapsed `deepDive` is attached at the bottom.

```dart
class ConceptBody {
  final String definition;        // 1–2 sentences, plain language
  final String whyItMatters;      // real-world relevance / where it shows up on the job
  final String example;           // short code snippet OR a concrete scenario
  final String? commonPitfall;    // the misconception that trips people up
  final String? interviewAngle;   // how this actually gets asked, phrased as a question
  final List<QuickCheck> quickChecks; // 1–2 tiny recall questions, answer hidden until tapped
  final DeepDive? deepDive;       // optional collapsed extension, self-flagged by Gemini (§2.4)
}

class QuickCheck {
  final String question;
  final String answer; // short, revealed on tap — not a scored quiz, just self-check
}

class DeepDive {
  final String? title;                   // e.g. "Consensus Protocol Mechanics & Invariants"
  final int estimatedReadSeconds;        // computed: ~180s (intermediate) to ~420s (advanced)
  final List<DeepDiveSection> sections; // structured in-depth breakdown
}

class DeepDiveSection {
  final String heading;                  // e.g. "Under the Hood: Log Replication"
  final String content;                  // deep technical explanation
  final String? codeSnippet;             // optional code or architectural diagram
}
```

### 2.4 Hard word budget & The Two-Layer Content Model

This is what makes "under 2 minutes" real while still giving dense topics room to breathe:

1. **Mandatory Core Card (All Concepts):**
   Every concept gets the full ~230-word core card, no exceptions — that's the guarantee users can always rely on across every difficulty level.

   | Section | Word cap |
   |---|---|
   | definition | 40 |
   | whyItMatters | 60 |
   | example | 60 (code doesn't count toward word cap, judged separately by line count ≤ 12) |
   | commonPitfall | 40 |
   | interviewAngle | 30 |
   | **Total core body** | **~230 words hard cap, 260 absolute max (~90–120 sec read)** |

2. **Optional "Go Deeper" Layer (`needsDeepDive`):**
   - For dense topics where two minutes really isn't enough (e.g. consensus algorithms, memory models, distributed transactions), Gemini self-flags `needsDeepDive: true` during generation (same pattern as `visualAid`).
   - The deep dive lives in a **separate, collapsed section** at the bottom of the card ("Go deeper (~6 min)" — tap to expand).
   - It **never** displaces the core card and **never** alters the "~90 sec read" badge seen while scanning lists or browsing.
   - Scaled word budget for Deep Dive:
     - **Beginner:** No deep dive by default (0 extra words).
     - **Intermediate:** Up to ~400 words (~3 extra minutes).
     - **Advanced:** Up to ~900 words (~6–7 extra minutes).
   - Total read time tops out around 8–10 minutes only for concepts that warrant it, and only for users who tap to expand.

### 2.5 Course object (an ordered playlist of existing concepts)

A course is **not** new content — it's a curated sequence over concepts that already exist and have already passed the checks in §4.6. That distinction matters: courses carry sequencing risk (bad ordering), not factual risk, so they can be produced and approved with a much lighter check than concept text itself.

```dart
class Course {
  final String id;
  final String slug;
  final String title;                // "System Design Fundamentals"
  final String description;          // 1–2 sentences: what it covers, who it's for
  final Category primaryCategory;
  final Difficulty difficulty;
  final List<String> conceptIds;     // ORDERED — the sequence is the course
  final int totalReadSeconds;        // sum of each concept's estimatedReadSeconds
  final String? coverImageUrl;       // same image pipeline + locked style as concepts (§4.4)
  final ContentStatus status;        // draft | needs_review | published
  final ContentSource source;        // ai_curated | human_curated
  final DateTime createdAt;
  final DateTime updatedAt;
  final int startedCount;
  final int completedCount;
}
```

Per-user progress, stored at `users/{uid}/courseProgress/{courseId}`:

```dart
class CourseProgress {
  final String courseId;
  final DateTime startedAt;
  final DateTime? completedAt; // set once every id in course.conceptIds is in the
                                // user's global learnedConceptIds set
}
```

Deliberately **not** storing a separate per-course "completed concepts" list — a concept marked "learned" is learned everywhere, including inside any course that contains it. Progress is derived at read time by intersecting the user's global learned set with `course.conceptIds`, so there's one source of truth instead of two that can drift out of sync.

---

## 3. Tagging & Search

### 3.1 Tags

- Tags are a **flat, controlled vocabulary** stored in their own Appwrite Databases collection (`tags`), not free text per concept — this prevents "Big-O" / "Big O Notation" / "big-o-notation" from fragmenting into three tags.
- Schema: `{ id, name, slug, usageCount, category }`.
- When Gemini suggests tags for a new concept, they're matched against the existing tag list (normalize: lowercase, strip punctuation, then exact match; if no match, fuzzy match via simple Levenshtein distance ≤2 before creating a new tag). New tags land in a small review queue rather than being auto-created silently.
- UI: tags render as tappable chips on every card; tapping a chip filters the browse/search view to that tag.

### 3.2 Search

For v1 scale (low thousands of concepts), skip a heavy search infra:

- **Appwrite's built-in fulltext indexes**: add a fulltext index on `title` (and one on a denormalized `tagNames` array) in the Databases collection, then query with the `Query.search()` helper in the SDK — this covers prefix/keyword search natively, no separate service.
- **When it outgrows that** (tens of thousands of concepts, or you want real typo-tolerance/ranking): add **Meilisearch** or **Typesense** as a separate self-hosted or managed service, synced from an Appwrite Function on document-write events. Unlike Firebase, Appwrite doesn't have a one-click search extension for this, so budget a bit more setup time if you outgrow the built-in index — worth flagging now rather than assuming it's a free swap later.
- Search screen: search bar + recent searches (stored locally) + trending tags below it when the query is empty, so the screen is never a blank box.

---

## 4. Fully Automated Pipeline — Roadmap → Topic → Content → Image → Publish

Everything below runs inside Appwrite Functions (Go runtime) on a cron schedule. No admin manually picks topics or clicks "generate" — the roadmap replenishes itself, topics get claimed and processed in batches, and the default outcome for a topic is publication with no human in the loop. A human only sees the small percentage that fail automated checks. This is a meaningful trust shift from a manual-review model, so §4.5 spells out exactly what keeps that safe.

### 4.0 Roadmap collection (self-expanding topic backlog)

`roadmapTopics/{id}`: `{ topic, category, difficulty, priority, status: 'pending'|'claimed'|'done'|'failed', source: 'seed'|'ai_expanded', attempts, createdAt }`

- Seed it once with a curated list per category to bootstrap (a few hundred titles is enough to start).
- Appwrite Function `expandRoadmap`, triggered by a cron schedule (weekly, or tighten later if a category runs thin faster than expected) asks Gemini for more topics in a thin category, given the existing titles so it doesn't repeat itself:

```
List 30 essential software engineering concepts in the category "{{category}}"
that a working developer would realistically encounter on the job or be asked
about in an interview. Do not repeat any of these existing topics: {{existingTitles}}.
Return a JSON array of {"topic": "...", "difficulty": "beginner|intermediate|advanced"}.
```

- New topics are normalized (lowercase, strip punctuation) and checked against both `roadmapTopics` and `concepts` titles before insert, so the same idea doesn't get generated twice under slightly different names.

### 4.1 Orchestrator — `runContentPipeline` (Appwrite cron trigger)

Runs on a schedule you control (e.g. daily, or a few times a week — tune to your Gemini budget), configured directly in the function's Settings → Schedule as a cron expression. One invocation processes a batch:

```
1. Query roadmapTopics where status == 'pending', order by priority, limit BATCH_SIZE (e.g. 15)
2. Claim them: update each doc's status to 'claimed' scoped by status == 'pending'
   (optimistic — Appwrite Databases doesn't have Firestore-style multi-doc transactions,
   so a claim that fails because another run already flipped the status is treated as
   "someone else has it," not an error)
3. Process with bounded concurrency (3–4 at a time, not all at once — respects Gemini rate limits):
     a. generate text  (§4.2/4.3)
     b. run automated self-check  (§4.5)
     c. all pass  → write to the concepts collection, status = 'published', publishedAt = now
        any fail  → write doc, status = 'needs_review', needsReviewReasons = [...]
     d. mark the roadmapTopics doc 'done' either way (failures still get a record)
4. Write a pipelineRuns summary doc: { startedAt, finishedAt, attempted, published,
   needsReview, errors: [...] } — this is your dashboard; you check this doc, not every item.
```

Appwrite Functions support configurable execution timeouts well beyond what a 15-topic batch needs (a few text calls each), so this stays one straightforward function, not a chain of triggers — simpler to debug solo.

### 4.2 Gemini text call — structured output

```go
req, _ := http.NewRequest("POST",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
    bytes.NewBuffer(mustJSON(map[string]any{
        "contents": []any{map[string]any{
            "parts": []any{map[string]any{"text": buildPrompt(topic, category, difficulty)}},
        }},
        "generationConfig": map[string]any{
            "responseMimeType": "application/json",
            "responseSchema":   conceptBodySchema, // matches ConceptBody exactly
            "temperature":      0.4,
        },
    })))
req.Header.Set("Content-Type", "application/json")
req.Header.Set("x-goog-api-key", geminiAPIKey) // pulled from Appwrite Function env var
resp, err := httpClient.Do(req)
```

### 4.3 Prompt template

The model writes the mandatory ~230-word core card for all concepts. It also decides whether a visual helps (`visualAid`) and self-flags whether dense technical complexity warrants an optional extended deep dive (`needsDeepDive`):

```
You are writing one entry for a software engineering reference app.
Topic: {{topic}}
Category: {{category}}
Difficulty: {{difficulty}}

Write in plain, direct language. No buzzwords, no hype, no filler phrases
like "in today's fast-paced world." Assume the reader is a working developer,
not a beginner to computing in general.

CORE CARD RULES:
1. Definition: strictly <= 40 words.
2. Why It Matters: strictly <= 60 words.
3. Example: strictly <= 60 words or <= 12 lines of code.
4. Common Pitfall: strictly <= 40 words.
5. Interview Angle: strictly <= 30 words.
6. Total word count across core body (definition + whyItMatters + example + commonPitfall + interviewAngle) must NOT exceed 230 words.
7. Include 1-2 QuickChecks (question + concise answer).

DEEP DIVE RULES (OPTIONAL EXTENSION):
- If the topic is genuinely dense (e.g. consensus algorithms, memory models, distributed transactions, internal engine mechanics) where 2 minutes isn't enough, set "needsDeepDive": true and provide "deepDive".
- For concepts that can be explained adequately in 2 minutes, set "needsDeepDive": false and omit "deepDive".
- Deep dive word budget:
  * beginner: no deep dive ("needsDeepDive": false).
  * intermediate: up to ~400 words (~3 min extra read).
  * advanced: up to ~900 words (~6–7 min extra read).

Return ONLY valid JSON matching this exact shape:
{
  "definition": "1-2 sentences, max 40 words",
  "whyItMatters": "real-world relevance, max 60 words",
  "example": "a short code snippet or concrete scenario, max 60 words / 12 lines",
  "commonPitfall": "the most common misconception, max 40 words",
  "interviewAngle": "how this is actually asked in interviews, phrased as a question, max 30 words",
  "quickChecks": [
    {"question": "short recall question", "answer": "short answer"}
  ],
  "suggestedTags": ["tag-slug-1", "tag-slug-2"],
  "visualAid": true,
  "imagePrompt": "if visualAid is true, describe ONE simple visual concept for an illustration. Leave empty string if false.",
  "needsDeepDive": true,
  "deepDive": {
    "title": "In-Depth Architectural & Protocol Mechanics",
    "estimatedReadSeconds": 360,
    "sections": [
      {
        "heading": "Under the Hood: State Machine Replication",
        "content": "Detailed walkthrough of state transitions, commit logs, and failure recovery...",
        "codeSnippet": "// Optional code or pseudo-code"
      }
    ]
  }
}
```

### 4.4 Image generation — manual, via Google Flow (not an API call)

Since image gen isn't free at API scale but you already have it covered through your **Gemini Pro plan's Google Flow credits**, this one step stays manual rather than living inside the Cloud Function — everything else in the pipeline is still automatic around it.

**This does not block publishing.** A concept with `visualAid: true` publishes immediately on text + self-check passing, with `heroImageUrl` left null — the image attaches later without needing a republish or a status change.

Workflow:

1. `runContentPipeline` still writes `visualAid` and `imagePrompt` on every concept (§4.3) — Gemini decides and drafts the brief automatically, same as before. Only the *rendering* moves to a human.
2. A new **Image Queue** screen (part of the same fallback/admin surface, §7.1) lists every published concept where `visualAid == true` and `heroImageUrl` is still null, showing each one's `imagePrompt` with a copy button.
3. You paste the prompt into Google Flow (wrapping it with the same fixed style prefix — flat vector, 2–3 color palette, no text in image, square composition — so the manually generated images still match the auto-generated catalog look), generate, download.
4. Upload the file directly from that same Image Queue screen — it goes to an Appwrite Storage bucket (`concept-images`, file ID = conceptId), and the screen writes the resulting file URL to `heroImageUrl` on submit. No separate admin tooling needed; this is one small addition to the screen you already have.

Trade-off worth naming: this reintroduces a manual step into an otherwise hands-off pipeline, and it's the one part of the system that won't keep up automatically if content volume grows a lot — worth revisiting with the API path (§ previous version, still valid if you want it later) if the queue starts backing up.

- Placement: the hero image sits **between `whyItMatters` and `example`** in the reading order (§5.2) — the natural pause point between the two densest text blocks, which is what "in between text" means functionally, not just visually.
- Not every concept gets one. Forcing an illustration onto "how to answer a conflict question" produces decoration, not signal — the `visualAid` flag keeps images purposeful rather than default-on, same as before.

### 4.5 Automated approval (replaces manual review as the default path)

This is the part worth being deliberate about: "approve" going from a human clicking a button to a machine deciding is the actual risk in this pipeline, since wrong technical content in an interview-prep app costs someone something real. The design below automates the common case while keeping a narrow, fast fallback for anything uncertain — full removal of any check isn't recommended, but the check itself is now automatic, not a person reading every card.

A concept auto-publishes only if **all** of the following pass; otherwise it's written as `needs_review` with the specific failure reasons attached (so the fallback screen tells you *why*, not just *that*):

1. **Schema check** — JSON parses, all mandatory core fields non-empty.
2. **Core word-count gate** — total core body ≤ 260 words (§2.4), reject/regenerate up to 2 retries before failing.
3. **Deep dive budget gate** — if `needsDeepDive: true`, deep dive word count must not exceed difficulty budget (≤ 450 words for intermediate, ≤ 950 words for advanced; beginner concepts must not have deep dive).
4. **Self-check pass** — a second, separate Gemini call, given the generated JSON, asked to rate factual accuracy and flag any error:
   ```
   Review this content for factual accuracy: {{generatedJSON}}
   Return JSON: { "pass": true|false, "issues": ["..."] }
   Fail if there is any incorrect technical claim, wrong complexity, wrong
   protocol/algorithm detail, or a misleading interview framing. Minor style
   issues are not a failure reason.
   ```
5. **Image is not a publish gate** — `visualAid` and `imagePrompt` just get written to the doc; the image itself is generated manually later (§4.4) and never blocks a concept from publishing.

- **Spot-check quota**: independent of the auto-check above, re-run the self-check prompt against a random 10% of already-published cards weekly — catches drift if a prompt version turns out weaker than expected, without needing you to read everything.
- **Staleness**: `promptVersion` on each concept lets you find and regenerate everything written under an older prompt in one query, if you tighten the prompt later.

### 4.6 Cost & rate control

- Default to `gemini-3.8-flash` for both the generation and self-check text calls — cheap enough that the two-call pattern per topic is still inexpensive at this content length.
- Bounded concurrency (3–4 topics in flight, not the whole batch at once) keeps you under Gemini's per-minute rate limits without needing a queueing system.
- Gemini API key stored as an encrypted Appwrite Function environment variable, never hardcoded or committed.
- No image API spend — image generation runs through Google Flow credits already included in your Gemini Pro plan, not the billed Gemini API (§4.4). The only cost left in the pipeline is the two text calls per concept.

### 4.7 Course curation — `curateCourses` (reuses already-published concepts)

Runs after concepts, not instead of them: courses are assembled from the pool of concepts that already exist and already passed §4.5, so this step carries sequencing risk, not factual risk, and can auto-publish more freely.

Scheduled (e.g. weekly), runs per category — and once a category has enough concepts, per difficulty band within it too, which is what naturally produces *several* distinct courses per category (e.g. "DSA Fundamentals" vs. "DSA for Senior Interviews") rather than one:

```
Given this list of published concepts in {{category}} / {{difficulty}}
(id, title, one-liner): {{conceptList}}

Pick 8–15 that form a coherent learning progression from foundational to
more advanced, in the order a learner should read them. Return JSON:
{
  "title": "short course title",
  "description": "1-2 sentences: what this covers and who it's for",
  "orderedConceptIds": ["id1", "id2", ...]
}
Only include IDs from the list provided.
```

Validation before publish:
- every `orderedConceptIds` entry exists and has `status: published` (strip any that don't)
- course size lands within 6–20 concepts after stripping
- **dedupe check**: if the returned concept set overlaps more than ~70% with an existing published course, skip the write — this is what stops the same category spitting out near-identical courses every run
- optional cover image, generated manually the same way as concept hero images (§4.4) and uploaded from the same Image Queue screen, so course covers match the rest of the catalog rather than looking like a separate product

Cross-category flagship courses (e.g. "Backend Interview Crash Course" spanning system design + databases + networking) take more editorial judgment than a single-category playlist — worth hand-curating those (`source: human_curated`) rather than teaching the auto-curator to reach across categories from day one.

---

## 5. UI/UX

Design priority: **typography-first.** This app is mostly text, read quickly, often at night — the design should get out of the way of reading, not decorate it.

### 5.1 Screens

| Screen | Purpose |
|---|---|
| **Home** | Today's concept (large card, one tap to read), streak indicator, horizontal category chips, "trending / most bookmarked" row |
| **Browse** | Category grid → tag/difficulty filter → concept list |
| **Courses** | Available learning paths, grouped by category — title, difficulty, concept count, total time, progress bar if started |
| **Course detail** | Header (title, description, total time) → ordered concept list with a checkmark per completed one → tap any concept to read it |
| **Search** | Search bar, recent searches, trending tags when empty |
| **Concept detail** | The card itself: title → definition → why it matters → example → pitfall → interview angle → quick checks (tap to reveal) → optional collapsed "Go deeper" section → related concepts row |
| **Bookmarks** | Saved concepts, same list UI as Browse |
| **Profile** | Streak calendar, concepts-learned count per category, theme toggle, notification settings |

### 5.2 Concept detail card — layout notes

- Small "~90 sec read" badge near the title, calculated from the core card `estimatedReadSeconds` — this is the app's core promise, make it visible and consistent across all cards and browse lists.
- Sections are visually distinct (definition in larger type, pitfall in a subtly flagged block) but **not walled off in accordions** — the core ~230-word card reads top-to-bottom in one continuous scroll.
- "Mark as learned" + bookmark icon in the app bar, not buried at the bottom.
- When `heroImageUrl` is present, it renders between "why it matters" and the example — a visual breather at the natural midpoint, not a banner stacked above the title.
- Quick-check questions are collapsed by default (answer hidden), tap to reveal — this is appropriate since revealing the answer immediately would let the eye skip straight to it.
- **Optional "Go Deeper" Collapsed Section:**
  - For concepts where `needsDeepDive: true` and `deepDive` content exists, a **separate collapsed accordion** is rendered at the bottom: `"Go deeper (~6 min)"` (with estimated read time for the deep dive).
  - Tap to expand reveals structured sections (e.g. deep architectural mechanics, state machine nuances, code diagrams).
  - It **never** displaces the core card and **never** changes the "~90 sec read" badge seen when scanning lists.
- When a concept is opened from within a course, a slim "next in course" bar sits at the bottom — tapping it advances to the next concept in that course's sequence without a trip back to the course screen.

### 5.3 Visual direction

- Category-based accent colors (e.g., DSA = one hue, System Design = another) used sparingly — a colored left-edge on cards and category chips, not full-color backgrounds — so it aids scanning without becoming noisy.
- Dark mode as a first-class default, not an afterthought — this is the mode most of this app's actual usage will happen in.
- Generous line-height and a slightly larger base font size than typical apps default to; this content lives or dies on being comfortable to read in short bursts.

---

## 6. Flutter Architecture

Matches your existing stack direction (Flutter + Riverpod) and file-size discipline, now on Appwrite instead of Firebase for this project.

### 6.1 Layering

```
lib/
  core/
    theme/              # colors, typography, light+dark ThemeData
    constants/
    utils/               # word-count helper, read-time calculator, tag normalizer
  data/
    models/              # Concept, ConceptBody, Tag, QuickCheck, Course, CourseProgress
    repositories/         # ConceptRepository, TagRepository, SearchRepository, CourseRepository
    services/
      appwrite_service.dart
      cache_service.dart   # Hive/Isar wrapper for offline reads
  features/
    home/
      presentation/       # HomeScreen, DailyConceptCard, TrendingRow widgets
      application/        # home_providers.dart (Riverpod)
    browse/
    courses/
      presentation/       # CourseListScreen, CourseDetailScreen, CourseProgressBar
      application/        # course_providers.dart
    search/
    concept_detail/
    bookmarks/
    profile/
  app/
    router.dart           # go_router config
    app.dart               # MaterialApp / theme wiring
```

Keep the ~200-line-per-file discipline: split large widget files by section (e.g. `concept_detail_screen.dart` + `concept_body_view.dart` + `quick_check_widget.dart` rather than one long file).

### 6.2 State management (Riverpod)

- `conceptListProvider(filter)` — `AsyncNotifierProvider` over Appwrite Databases query results, keyed by category/tag/difficulty filter.
- `conceptDetailProvider(id)` — single-doc fetch, with a Realtime subscription on that document for live updates (Appwrite's equivalent of a Firestore stream provider).
- `bookmarksProvider` — local-first (Hive) mirrored to Appwrite Databases for cross-device sync, so bookmarking never waits on network.
- `streakProvider` — derived from a `lastActiveDate` + `streakCount` field on the user doc, updated on app open.
- `searchProvider(query)` — debounced (300ms), hits Appwrite's fulltext index or an external search service depending on which backend is live (§3.2).
- `courseListProvider(filter)` — Appwrite Databases query over `courses`, keyed by category/difficulty.
- `courseProgressProvider(courseId)` — derived, not stored: intersects the user's global learned-concepts set with `course.conceptIds` to compute percent-complete and per-concept checkmarks.

### 6.3 Offline support

- Concepts are small (~1–2KB each as JSON) — cache the last N viewed/bookmarked concepts in Hive/Isar so "read without signal" works for anything already opened once.
- Worth flagging honestly: **Appwrite doesn't ship automatic offline persistence the way Firestore does** — there's no built-in local cache that transparently serves reads when the network drops. That means Hive/Isar isn't just a nice-to-have here, it's the actual offline strategy: every read the app cares about offline needs an explicit write-through to the local cache, and a manual sync-on-reconnect for anything queued while offline (like a bookmark toggled without signal). More to build than the Firebase version of this spec assumed.

---

## 7. Backend

- **Appwrite Auth** — anonymous sessions to start (zero-friction first open), upgrade to Google OAuth for cross-device sync/streak persistence.
- **Appwrite Databases** — collections: `concepts`, `tags`, `courses`, `roadmapTopics`, `pipelineRuns` (run logs), `users` (bookmarks, streak, learned list), `courseProgress` (linked to a user via a relationship attribute or a `userId` field).
- **Appwrite Storage** — a `concept-images` bucket, publicly readable via bucket permissions; writes come from the Functions' API key (course/tag housekeeping) and from your authenticated admin session via the Image Queue upload (§4.4), not from any public client.
- **Appwrite Functions (Go runtime)** — cron-scheduled from each function's Settings → Schedule, no separate infra:
  - `expandRoadmap` — replenishes thin categories (§4.0)
  - `runContentPipeline` — the main orchestrator: text → self-check → publish/flag, writes `visualAid`/`imagePrompt` for later manual image generation (§4.1–4.6)
  - `curateCourses` — assembles ordered playlists from already-published concepts (§4.7)
  - `onConceptPublish` — triggered by an Appwrite database event (`databases.*.collections.concepts.documents.*.update`), updates tag usage counts and category counts whenever a concept's status flips to `published`
- **Function environment variables** (encrypted at rest) — Gemini API key, referenced by the Functions, never hardcoded.
- **API key scoping** — the Functions' server API key is scoped to exactly the Databases/Storage permissions it needs, not a blanket admin key; client-side Flutter code uses the public/anonymous session, never the server key.
- **Appwrite doesn't have a direct Firebase-Analytics equivalent built in** — for the engagement data that feeds `expandRoadmap`'s category-growth decisions (§4.0), plan on a lightweight custom events collection (`analyticsEvents`, written from the app on view/bookmark/quick-check) or a drop-in third-party analytics SDK (e.g. PostHog, which self-hosts too if that matters to you) rather than assuming it's included.

### 7.1 Fallback review surface

Since publishing is now automatic by default, this is a small exception-handling screen, not the main workflow: a simple authenticated view inside the app (visible only to an account with an admin **Team** membership — Appwrite's role-based grouping, used here the way a Firebase custom claim would be) with two lists —

- `needs_review` items with their `needsReviewReasons`, so you're fixing a named problem rather than re-checking from scratch
- the **Image Queue** (§4.4): published concepts/courses with `visualAid: true` and no image yet, each with its `imagePrompt` ready to copy into Google Flow and an upload control that writes straight to `heroImageUrl`

Expect both lists to stay manageable — the review list is the safety net under an automated pipeline, and the image queue is the one deliberately manual step in it.

---

## 8. Packages (starting list)

**Flutter app:** `flutter_riverpod`, `go_router`, `appwrite` (official Dart SDK — Databases, Storage, Auth, Realtime), `hive` + `hive_flutter` (offline cache), `google_fonts`, `flutter_svg`, `cached_network_image` (hero images), `share_plus`, `shimmer` (loading skeletons on card lists), `flutter_local_notifications` (daily-concept reminder), `intl` (date formatting for streak calendar).

**Appwrite Functions (Go, separate directories per function):** standard library `net/http` for the Gemini REST calls, `github.com/appwrite/sdk-for-go` for Databases/Storage access from within a function, `encoding/json` for schema parsing — deliberately minimal; this workload doesn't need a web framework.

---

## 9. Phased Roadmap

**Phase 1 — MVP**
Seed `roadmapTopics` with ~150–250 titles across DSA, System Design, OS/Networking, and general SWE; let `runContentPipeline` generate and auto-publish the first batch, with the fallback review screen catching anything flagged. Once each category has enough published concepts, `curateCourses` assembles the first courses. Home, Browse, Courses, Search, Concept detail, Bookmarks, dark/light theme, daily concept, basic streak.

**Phase 2 — Retention loop**
Quick-check-based spaced repetition (light SM-2: a card marked "shaky" resurfaces in 1/3/7 days), company-tagged concepts, offline downloads for a whole category, push notification for the daily concept.

**Phase 3 — Scale content & community**
User-suggested topics (queued into the same AI+approval pipeline), personalized feed based on a stated target role (e.g. "backend," "mobile"), Meilisearch/Typesense if the catalog has outgrown Appwrite's built-in fulltext index (§3.2).

---

## 10. Open Questions (worth deciding before build starts)

- Appwrite Cloud (hosted, zero ops) vs. self-hosting Appwrite yourself — Cloud is the simpler starting point and matches everything above; self-hosting is a real option later if cost or control becomes a concern, but adds server management this spec doesn't currently account for.
- Final app name/branding.
- Anonymous-only auth for v1, or Google sign-in from day one (affects whether streak/bookmarks survive a reinstall)?
- Who checks the fallback `needs_review` queue day to day — just you, or is a lightweight second reviewer needed once volume grows?
- How often should `runContentPipeline` run and how large a batch — this is a direct trade-off between how fast the catalog fills up and Gemini spend.
- How many concepts need to exist in a category before `curateCourses` should start generating for it — too early and courses feel thin.
- Any monetization plan for v1, or fully free until there's a user base worth monetizing?
