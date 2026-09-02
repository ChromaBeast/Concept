import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:concept/data/data.dart';

void main() {
  group('ConceptRepository Tests', () {
    late Directory tempDir;
    late CacheService cacheService;
    late UserRepository userRepository;
    late ConceptRepository conceptRepository;

    setUp(() async {
      tempDir = Directory.systemTemp.createTempSync('hive_concept_repo_test_');
      Hive.init(tempDir.path);
      cacheService = CacheService();
      await cacheService.init();

      userRepository = UserRepository(cacheService: cacheService);
      conceptRepository = ConceptRepository(
        cacheService: cacheService,
        userRepository: userRepository,
      );

      const seedService = SeedDataService();
      await seedService.seedIfEmpty(cacheService);
    });

    tearDown(() async {
      await Hive.close();
      if (tempDir.existsSync()) {
        tempDir.deleteSync(recursive: true);
      }
    });

    test('fetches concepts with category, tag, and difficulty filters', () async {
      final all = await conceptRepository.getConcepts();
      expect(all.length, greaterThanOrEqualTo(15));

      final dsa = await conceptRepository.getConcepts(category: Category.dsa);
      expect(dsa.every((c) => c.category == Category.dsa), isTrue);

      final beginner = await conceptRepository.getConcepts(
        difficulty: Difficulty.beginner,
      );
      expect(beginner.every((c) => c.difficulty == Difficulty.beginner), isTrue);

      final tagged = await conceptRepository.getConcepts(tagId: 'tag-binary-search');
      expect(tagged.length, 1);
      expect(tagged.first.title, 'Binary Search');
    });

    test('retrieves concept by ID and slug', () async {
      final byId = await conceptRepository.getConceptById('concept-binary-search');
      expect(byId?.title, 'Binary Search');

      final bySlug = await conceptRepository.getConceptBySlug('cap-theorem');
      expect(bySlug?.id, 'concept-cap-theorem');
    });

    test('toggles bookmark and updates concept bookmark count', () async {
      const userId = 'user_123';
      const conceptId = 'concept-lru-cache';

      final initial = await conceptRepository.getConceptById(conceptId);
      final initialCount = initial!.bookmarkCount;

      final bookmarked = await conceptRepository.toggleBookmark(userId, conceptId);
      expect(bookmarked, isTrue);

      final afterAdd = await conceptRepository.getConceptById(conceptId);
      expect(afterAdd?.bookmarkCount, initialCount + 1);

      final bookmarks = await conceptRepository.getBookmarkedConcepts(userId);
      expect(bookmarks.map((c) => c.id), contains(conceptId));

      final unbookmarked = await conceptRepository.toggleBookmark(userId, conceptId);
      expect(unbookmarked, isFalse);

      final afterRemove = await conceptRepository.getConceptById(conceptId);
      expect(afterRemove?.bookmarkCount, initialCount);
    });

    test('marks as learned and retrieves learned concepts', () async {
      const userId = 'user_456';
      const conceptId = 'concept-trie';

      final isLearned = await conceptRepository.markAsLearned(userId, conceptId);
      expect(isLearned, isTrue);

      final learned = await conceptRepository.getLearnedConcepts(userId);
      expect(learned.map((c) => c.id), contains(conceptId));
    });

    test('increments view count and retrieves related concepts & daily picks', () async {
      const conceptId = 'concept-binary-search';
      final initial = await conceptRepository.getConceptById(conceptId);

      await conceptRepository.incrementViewCount(conceptId);
      final updated = await conceptRepository.getConceptById(conceptId);
      expect(updated?.viewCount, initial!.viewCount + 1);

      final related = await conceptRepository.getRelatedConcepts(conceptId);
      expect(related, isNotEmpty);

      final picks = await conceptRepository.getDailyPicks(limit: 3);
      expect(picks.length, 3);
    });
  });
}
