import 'package:flutter_test/flutter_test.dart';
import 'package:concept/data/models/models.dart';

void main() {
  group('Data Models Serialization Tests', () {
    test('QuickCheck toMap and fromMap', () {
      const qc = QuickCheck(
        question: 'What is CAP?',
        answer: 'Consistency, Availability, Partition tolerance',
      );
      final map = qc.toMap();
      final parsed = QuickCheck.fromMap(map);
      expect(parsed, qc);
      expect(QuickCheck.fromJson(qc.toJson()), qc);
    });

    test('ConceptBody toMap and fromMap', () {
      const body = ConceptBody(
        definition: 'CAP theorem states that a distributed data store...',
        whyItMatters: 'Essential for choosing between CP and AP databases.',
        example: 'In MongoDB vs Cassandra partition scenarios...',
        commonPitfall: 'Assuming CA is possible under network partition.',
        interviewAngle: 'When would you pick AP over CP?',
        quickChecks: [
          QuickCheck(question: 'What is P?', answer: 'Partition tolerance')
        ],
      );
      final map = body.toMap();
      final parsed = ConceptBody.fromMap(map);
      expect(parsed, body);
      expect(ConceptBody.fromJson(body.toJson()), body);
    });

    test('Concept toMap and fromMap with Appwrite document fields', () {
      final now = DateTime.utc(2026, 9, 2, 12, 0, 0);
      final concept = Concept(
        id: 'c1',
        slug: 'cap-theorem',
        title: 'CAP Theorem',
        oneLiner: 'You can only pick two of Consistency, Availability, Partition tolerance.',
        category: Category.systemDesign,
        difficulty: Difficulty.intermediate,
        body: const ConceptBody(
          definition: 'Definition',
          whyItMatters: 'Why it matters',
          example: 'Example',
        ),
        estimatedReadSeconds: 90,
        createdAt: now,
        updatedAt: now,
        tagIds: const ['distributed-systems', 'databases'],
        status: ContentStatus.published,
        source: ContentSource.aiGenerated,
        visualAid: true,
        heroImageUrl: 'https://cloud.appwrite.io/v1/storage/buckets/concept-images/files/c1',
      );

      final map = concept.toMap();
      final parsed = Concept.fromMap(map);
      expect(parsed.id, concept.id);
      expect(parsed.slug, concept.slug);
      expect(parsed.category, Category.systemDesign);
      expect(parsed.difficulty, Difficulty.intermediate);
      expect(parsed.status, ContentStatus.published);
      expect(parsed.visualAid, isTrue);
      expect(parsed.heroImageUrl, concept.heroImageUrl);
      expect(parsed, concept);
    });

    test('Tag model serialization', () {
      const tag = Tag(
        id: 't1',
        name: 'Distributed Systems',
        slug: 'distributed-systems',
        usageCount: 15,
        category: Category.systemDesign,
      );
      final map = tag.toMap();
      final parsed = Tag.fromMap(map);
      expect(parsed, tag);
      expect(Tag.fromJson(tag.toJson()), tag);
    });

    test('Course and CourseProgress serialization', () {
      final now = DateTime.utc(2026, 9, 2, 12, 0, 0);
      final course = Course(
        id: 'course-1',
        slug: 'sys-design-101',
        title: 'System Design Fundamentals',
        description: 'Learn distributed fundamentals.',
        primaryCategory: Category.systemDesign,
        difficulty: Difficulty.intermediate,
        conceptIds: const ['c1', 'c2', 'c3'],
        totalReadSeconds: 270,
        createdAt: now,
        updatedAt: now,
        startedCount: 10,
        completedCount: 4,
      );
      expect(Course.fromMap(course.toMap()), course);

      final progress = CourseProgress(
        courseId: 'course-1',
        startedAt: now,
        completedAt: now,
      );
      expect(progress.isCompleted, isTrue);
      expect(CourseProgress.fromMap(progress.toMap()), progress);
    });

    test('UserProfile serialization', () {
      final now = DateTime.utc(2026, 9, 2, 12, 0, 0);
      final profile = UserProfile(
        userId: 'u123',
        streakCount: 5,
        lastActiveDate: now,
        learnedConceptIds: const ['c1', 'c2'],
        bookmarkedConceptIds: const ['c1'],
        themeMode: 'dark',
      );
      expect(UserProfile.fromMap(profile.toMap()), profile);
    });

    test('RoadmapTopic and PipelineRun serialization', () {
      final now = DateTime.utc(2026, 9, 2, 12, 0, 0);
      final topic = RoadmapTopic(
        id: 'rt1',
        topic: 'Raft Consensus',
        category: Category.systemDesign,
        difficulty: Difficulty.advanced,
        priority: 1,
        status: RoadmapStatus.claimed,
        source: RoadmapSource.aiExpanded,
        attempts: 1,
        createdAt: now,
      );
      expect(RoadmapTopic.fromMap(topic.toMap()), topic);

      final run = PipelineRun(
        id: 'run-1',
        startedAt: now,
        finishedAt: now,
        attempted: 15,
        published: 14,
        needsReview: 1,
        errors: const ['c15: word count exceeded'],
      );
      expect(PipelineRun.fromMap(run.toMap()), run);
    });
  });
}
