import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:concept/data/data.dart';

void main() {
  group('AdminRepository Tests', () {
    late Directory tempDir;
    late CacheService cacheService;
    late AdminRepository adminRepository;

    setUp(() async {
      tempDir = Directory.systemTemp.createTempSync('hive_admin_repo_test_');
      Hive.init(tempDir.path);
      cacheService = CacheService();
      await cacheService.init();

      adminRepository = AdminRepository(cacheService: cacheService);
    });

    tearDown(() async {
      await Hive.close();
      if (tempDir.existsSync()) {
        tempDir.deleteSync(recursive: true);
      }
    });

    test('retrieves needs review concepts and handles review retry', () async {
      final flaggedConcept = Concept(
        id: 'c-review',
        slug: 'c-review',
        title: 'Needs Review Concept',
        oneLiner: 'Short one liner',
        category: Category.dsa,
        difficulty: Difficulty.beginner,
        status: ContentStatus.needsReview,
        estimatedReadSeconds: 60,
        needsReviewReasons: const ['Definition exceeds word limit'],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        body: const ConceptBody(
          definition: 'Short valid definition here.',
          whyItMatters: 'Short valid why.',
          example: 'Short valid example.',
        ),
      );

      await cacheService.saveConcept(flaggedConcept);

      final reviewQueue = await adminRepository.getNeedsReviewConcepts();
      expect(reviewQueue.length, 1);
      expect(reviewQueue.first.id, 'c-review');

      // Retry check: definition is valid, should pass and transition to published
      final retried = await adminRepository.retryConceptCheck('c-review');
      expect(retried?.status, ContentStatus.published);
      expect(retried?.needsReviewReasons?.isEmpty ?? true, isTrue);

      final updatedQueue = await adminRepository.getNeedsReviewConcepts();
      expect(updatedQueue, isEmpty);
    });

    test('retrieves image queue and updates hero image URL', () async {
      final visualConcept = Concept(
        id: 'c-image',
        slug: 'c-image',
        title: 'Visual Concept',
        oneLiner: 'Visual aid required',
        category: Category.systemDesign,
        difficulty: Difficulty.intermediate,
        estimatedReadSeconds: 60,
        visualAid: true,
        heroImageUrl: null,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        body: const ConceptBody(
          definition: 'Def',
          whyItMatters: 'Why',
          example: 'Ex',
        ),
      );

      await cacheService.saveConcept(visualConcept);

      final queue = await adminRepository.getImageQueue();
      expect(queue.length, 1);
      expect(queue.first.id, 'c-image');

      final updated = await adminRepository.updateHeroImageUrl(
        'c-image',
        'https://cloud.appwrite.io/v1/storage/buckets/images/files/c-image.png',
      );
      expect(updated?.heroImageUrl, contains('c-image.png'));

      final afterUpdateQueue = await adminRepository.getImageQueue();
      expect(afterUpdateQueue, isEmpty);
    });

    test('updates concept status directly', () async {
      final concept = Concept(
        id: 'c-draft',
        slug: 'c-draft',
        title: 'Draft Concept',
        oneLiner: 'One liner',
        category: Category.backend,
        difficulty: Difficulty.advanced,
        status: ContentStatus.draft,
        estimatedReadSeconds: 60,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        body: const ConceptBody(
          definition: 'Def',
          whyItMatters: 'Why',
          example: 'Ex',
        ),
      );

      await cacheService.saveConcept(concept);

      final updated = await adminRepository.updateConceptStatus(
        'c-draft',
        ContentStatus.published,
      );
      expect(updated?.status, ContentStatus.published);
      expect(cacheService.getConcept('c-draft')?.status, ContentStatus.published);
    });
  });
}
