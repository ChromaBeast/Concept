import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:concept/data/data.dart';

void main() {
  group('CacheService Tests', () {
    late Directory tempDir;
    late CacheService cacheService;

    setUp(() async {
      tempDir = Directory.systemTemp.createTempSync('hive_cache_test_');
      Hive.init(tempDir.path);
      cacheService = CacheService();
      await cacheService.init();
    });

    tearDown(() async {
      await Hive.close();
      if (tempDir.existsSync()) {
        tempDir.deleteSync(recursive: true);
      }
    });

    test('saves and retrieves concepts by ID and slug', () async {
      final concept = Concept(
        id: 'c-1',
        slug: 'slug-1',
        title: 'Title 1',
        oneLiner: 'One liner',
        category: Category.dsa,
        difficulty: Difficulty.beginner,
        body: const ConceptBody(
          definition: 'Def',
          whyItMatters: 'Why',
          example: 'Ex',
        ),
        estimatedReadSeconds: 60,
        createdAt: DateTime(2026, 1, 1),
        updatedAt: DateTime(2026, 1, 1),
      );

      await cacheService.saveConcept(concept);
      expect(cacheService.getConcepts().length, 1);
      expect(cacheService.getConcept('c-1')?.title, 'Title 1');
      expect(cacheService.getConceptBySlug('slug-1')?.id, 'c-1');
      expect(cacheService.getConcept('non-existent'), isNull);
    });

    test('saves and retrieves courses and tags', () async {
      final course = Course(
        id: 'course-1',
        slug: 'course-slug',
        title: 'Course 1',
        description: 'Desc',
        primaryCategory: Category.systemDesign,
        difficulty: Difficulty.intermediate,
        conceptIds: const ['c-1', 'c-2'],
        createdAt: DateTime(2026, 1, 1),
        updatedAt: DateTime(2026, 1, 1),
      );
      const tag = Tag(id: 't-1', name: 'Tag 1', slug: 'tag-1');

      await cacheService.saveCourse(course);
      await cacheService.saveTag(tag);

      expect(cacheService.getCourses().length, 1);
      expect(cacheService.getCourse('course-1')?.title, 'Course 1');
      expect(cacheService.getTags().length, 1);
      expect(cacheService.getTag('t-1')?.name, 'Tag 1');
    });

    test('manages recent searches and restricts to max limit', () async {
      for (int i = 1; i <= 15; i++) {
        await cacheService.addRecentSearch('query $i');
      }

      final searches = cacheService.getRecentSearches();
      expect(searches.length, 10);
      expect(searches.first, 'query 15');

      await cacheService.removeRecentSearch('query 15');
      expect(cacheService.getRecentSearches().contains('query 15'), isFalse);

      await cacheService.clearRecentSearches();
      expect(cacheService.getRecentSearches(), isEmpty);
    });

    test('tracks app settings and seed state', () async {
      expect(cacheService.isSeeded(), isFalse);
      await cacheService.setSeeded(true);
      expect(cacheService.isSeeded(), isTrue);

      expect(cacheService.getThemeMode(), 'system');
      await cacheService.setThemeMode('dark');
      expect(cacheService.getThemeMode(), 'dark');
    });
  });
}
