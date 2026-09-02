import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:concept/data/data.dart';

void main() {
  group('TagRepository Tests', () {
    late Directory tempDir;
    late CacheService cacheService;
    late TagRepository tagRepository;

    setUp(() async {
      tempDir = Directory.systemTemp.createTempSync('hive_tag_repo_test_');
      Hive.init(tempDir.path);
      cacheService = CacheService();
      await cacheService.init();

      tagRepository = TagRepository(cacheService: cacheService);

      const seedService = SeedDataService();
      await seedService.seedIfEmpty(cacheService);
    });

    tearDown(() async {
      await Hive.close();
      if (tempDir.existsSync()) {
        tempDir.deleteSync(recursive: true);
      }
    });

    test('retrieves all tags and filters by category', () async {
      final allTags = await tagRepository.getAllTags();
      expect(allTags.length, greaterThanOrEqualTo(20));

      final dsaTags = await tagRepository.getTagsByCategory(Category.dsa);
      expect(dsaTags, isNotEmpty);
      expect(dsaTags.every((t) => t.category == Category.dsa), isTrue);
    });

    test('retrieves tag by ID and slug', () async {
      final byId = await tagRepository.getTagById('tag-binary-search');
      expect(byId?.name, 'Binary Search');

      final bySlug = await tagRepository.getTagBySlug('cap-theorem');
      expect(bySlug?.id, 'tag-cap-theorem');

      final nonExistent = await tagRepository.getTagById('invalid-id');
      expect(nonExistent, isNull);
    });

    test('retrieves popular tags ordered by usage count', () async {
      final popular = await tagRepository.getPopularTags(limit: 5);
      expect(popular.length, 5);

      for (int i = 0; i < popular.length - 1; i++) {
        expect(
          popular[i].usageCount,
          greaterThanOrEqualTo(popular[i + 1].usageCount),
        );
      }
    });
  });
}
