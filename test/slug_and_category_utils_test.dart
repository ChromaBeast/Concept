import 'package:flutter_test/flutter_test.dart';
import 'package:concept/core/utils/category_utils.dart';
import 'package:concept/core/utils/slug_utils.dart';
import 'package:concept/data/models/enums.dart';

void main() {
  group('SlugUtils Tests', () {
    test('toSlug converts various strings', () {
      expect(SlugUtils.toSlug('CAP Theorem'), 'cap-theorem');
      expect(SlugUtils.toSlug('Big-O Notation!'), 'big-o-notation');
      expect(SlugUtils.toSlug('  Async / Await in Dart  '), 'async-await-in-dart');
    });

    test('normalizeTag normalizes tag strings', () {
      expect(SlugUtils.normalizeTag('Big-O'), 'big o');
      expect(SlugUtils.normalizeTag('Big O Notation'), 'big o notation');
      expect(SlugUtils.normalizeTag('big-o-notation'), 'big o notation');
      expect(SlugUtils.normalizeTag('  System Design  '), 'system design');
    });

    test('Levenshtein distance calculation', () {
      expect(SlugUtils.levenshteinDistance('kitten', 'sitting'), 3);
      expect(SlugUtils.levenshteinDistance('database', 'database'), 0);
      expect(SlugUtils.levenshteinDistance('algo', 'algos'), 1);
    });

    test('Fuzzy matching and tag deduplication', () {
      expect(SlugUtils.isFuzzyMatch('caching', 'cachng', maxDistance: 1), isTrue);
      expect(SlugUtils.isFuzzyMatch('react', 'angular', maxDistance: 2), isFalse);

      final existingTags = ['distributed-systems', 'databases', 'operating-systems'];
      expect(
        SlugUtils.findBestMatch('distributd-systems', existingTags),
        'distributed-systems',
      );
    });
  });

  group('CategoryUtils Tests', () {
    test('Category display names and slugs', () {
      expect(CategoryUtils.getDisplayName(Category.dsa), 'Data Structures & Algorithms');
      expect(CategoryUtils.getSlug(Category.systemDesign), 'system_design');
      expect(CategoryUtils.fromSlug('system_design'), Category.systemDesign);
    });

    test('Category accent colors and icons exist for all categories', () {
      for (final cat in Category.values) {
        final color = CategoryUtils.getAccentColor(cat);
        final icon = CategoryUtils.getIcon(cat);
        expect(color, isNotNull);
        expect(icon, isNotNull);
      }
    });
  });
}
