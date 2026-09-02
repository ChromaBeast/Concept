import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:concept/data/data.dart';

void main() {
  group('SearchRepository Tests', () {
    late Directory tempDir;
    late CacheService cacheService;
    late SearchRepository searchRepository;

    setUp(() async {
      tempDir = Directory.systemTemp.createTempSync('hive_search_repo_test_');
      Hive.init(tempDir.path);
      cacheService = CacheService();
      await cacheService.init();

      searchRepository = SearchRepository(cacheService: cacheService);

      const seedService = SeedDataService();
      await seedService.seedIfEmpty(cacheService);
    });

    tearDown(() async {
      await Hive.close();
      if (tempDir.existsSync()) {
        tempDir.deleteSync(recursive: true);
      }
    });

    test('searches by exact and partial title', () async {
      final exact = await searchRepository.searchConcepts('Binary Search');
      expect(exact, isNotEmpty);
      expect(exact.first.id, 'concept-binary-search');

      final partial = await searchRepository.searchConcepts('binary');
      expect(partial, isNotEmpty);
      expect(partial.first.title, 'Binary Search');
    });

    test('searches by tag name and oneLiner', () async {
      final byTag = await searchRepository.searchConcepts('caching');
      expect(byTag, isNotEmpty);
      expect(byTag.map((c) => c.id), contains('concept-lru-cache'));

      final byOneLiner = await searchRepository.searchConcepts('divide-and-conquer');
      expect(byOneLiner, isNotEmpty);
      expect(byOneLiner.first.id, 'concept-binary-search');
    });

    test('handles fuzzy typos with fallback matching', () async {
      // "binari" is 1 edit away from "binary"
      final fuzzy = await searchRepository.searchConcepts('binari');
      expect(fuzzy, isNotEmpty);
      expect(fuzzy.map((c) => c.id), contains('concept-binary-search'));
    });

    test('applies category and difficulty search filters', () async {
      final dsaOnly = await searchRepository.searchConcepts(
        'cache',
        category: Category.dsa,
      );
      expect(dsaOnly.every((c) => c.category == Category.dsa), isTrue);

      final empty = await searchRepository.searchConcepts(
        'binary',
        category: Category.databases,
      );
      expect(empty, isEmpty);
    });

    test('manages recent search queries', () async {
      await searchRepository.addRecentSearch('CAP Theorem');
      await searchRepository.addRecentSearch('LRU Cache');

      final recent = await searchRepository.getRecentSearches();
      expect(recent, ['LRU Cache', 'CAP Theorem']);

      await searchRepository.removeRecentSearch('LRU Cache');
      expect(await searchRepository.getRecentSearches(), ['CAP Theorem']);

      await searchRepository.clearRecentSearches();
      expect(await searchRepository.getRecentSearches(), isEmpty);
    });
  });
}
