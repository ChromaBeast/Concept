import 'package:flutter_test/flutter_test.dart';
import 'package:concept/core/utils/word_counter.dart';
import 'package:concept/data/data.dart';

void main() {
  group('Seed Dataset Integrity Tests', () {
    const seedService = SeedDataService();

    test('seed concepts are populated and have unique IDs and slugs', () {
      final concepts = seedService.allConcepts;
      expect(concepts.length, greaterThanOrEqualTo(15));

      final ids = concepts.map((c) => c.id).toSet();
      final slugs = concepts.map((c) => c.slug).toSet();

      expect(ids.length, equals(concepts.length));
      expect(slugs.length, equals(concepts.length));
    });

    test('all seed concepts comply with word budget rules', () {
      final concepts = seedService.allConcepts;
      for (final concept in concepts) {
        final validation = WordCounter.validateConceptBudget(concept.body);
        expect(
          validation.isValid,
          isTrue,
          reason: 'Concept "${concept.title}" failed word budget: ${validation.issues}',
        );
        expect(
          concept.body.quickChecks.length,
          greaterThanOrEqualTo(1),
          reason: 'Concept "${concept.title}" should have quick checks',
        );
      }
    });

    test('seed tags have unique IDs and valid categories', () {
      final tags = seedService.allTags;
      expect(tags.length, greaterThanOrEqualTo(20));

      final tagIds = tags.map((t) => t.id).toSet();
      expect(tagIds.length, equals(tags.length));

      for (final concept in seedService.allConcepts) {
        for (final tagId in concept.tagIds) {
          expect(
            tagIds.contains(tagId),
            isTrue,
            reason: 'Concept ${concept.id} references undefined tag $tagId',
          );
        }
      }
    });

    test('seed courses reference valid concept IDs and contain total read times', () {
      final courses = seedService.allCourses;
      expect(courses.length, equals(3));

      final conceptIds = seedService.allConcepts.map((c) => c.id).toSet();

      for (final course in courses) {
        expect(course.conceptIds.length, greaterThanOrEqualTo(4));
        expect(course.totalReadSeconds, greaterThan(0));

        for (final cid in course.conceptIds) {
          expect(
            conceptIds.contains(cid),
            isTrue,
            reason: 'Course ${course.id} references invalid concept $cid',
          );
        }
      }
    });
  });
}
