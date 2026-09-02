import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:concept/data/data.dart';

void main() {
  group('CourseRepository Tests', () {
    late Directory tempDir;
    late CacheService cacheService;
    late UserRepository userRepository;
    late CourseRepository courseRepository;

    setUp(() async {
      tempDir = Directory.systemTemp.createTempSync('hive_course_repo_test_');
      Hive.init(tempDir.path);
      cacheService = CacheService();
      await cacheService.init();

      userRepository = UserRepository(cacheService: cacheService);
      courseRepository = CourseRepository(
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

    test('fetches courses with category filters and retrieves by slug', () async {
      final courses = await courseRepository.getCourses();
      expect(courses.length, 3);

      final dsaCourses = await courseRepository.getCourses(
        category: Category.dsa,
      );
      expect(dsaCourses.length, 1);
      expect(dsaCourses.first.id, 'course-dsa-core-patterns');

      final bySlug = await courseRepository.getCourseBySlug(
        'system-design-fundamentals',
      );
      expect(bySlug?.id, 'course-system-design-fundamentals');
    });

    test('calculates accurate course progress across completion milestones', () async {
      const userId = 'user_student';
      const courseId = 'course-dsa-core-patterns'; // 4 concepts: binary-search, lru-cache, graph-bfs-dfs, trie

      final initialProgress = await courseRepository.getCourseProgress(userId, courseId);
      expect(initialProgress, isNotNull);
      expect(initialProgress!.completedConcepts, 0);
      expect(initialProgress.totalConcepts, 4);
      expect(initialProgress.completionPercentage, 0.0);
      expect(initialProgress.nextConceptId, 'concept-binary-search');
      expect(initialProgress.isCompleted, isFalse);
      expect(initialProgress.isStarted, isFalse);

      // Learn first 2 concepts
      await userRepository.toggleLearned(userId, 'concept-binary-search');
      await userRepository.toggleLearned(userId, 'concept-lru-cache');

      final halfProgress = await courseRepository.getCourseProgress(userId, courseId);
      expect(halfProgress!.completedConcepts, 2);
      expect(halfProgress.completionPercentage, 0.5);
      expect(halfProgress.nextConceptId, 'concept-graph-bfs-dfs');
      expect(halfProgress.isStarted, isTrue);
      expect(halfProgress.isCompleted, isFalse);

      // Learn remaining 2 concepts
      await userRepository.toggleLearned(userId, 'concept-graph-bfs-dfs');
      await userRepository.toggleLearned(userId, 'concept-trie');

      final fullProgress = await courseRepository.getCourseProgress(userId, courseId);
      expect(fullProgress!.completedConcepts, 4);
      expect(fullProgress.completionPercentage, 1.0);
      expect(fullProgress.nextConceptId, isNull);
      expect(fullProgress.isCompleted, isTrue);
    });

    test('increments course startedCount', () async {
      const courseId = 'course-backend-reliability';
      final before = await courseRepository.getCourseById(courseId);
      final initialCount = before!.startedCount;

      await courseRepository.startCourse(courseId);

      final after = await courseRepository.getCourseById(courseId);
      expect(after?.startedCount, initialCount + 1);
    });

    test('retrieves progress for all courses at once', () async {
      const userId = 'user_all';
      final list = await courseRepository.getAllCoursesWithProgress(userId);
      expect(list.length, 3);
      expect(list.every((info) => info.totalConcepts > 0), isTrue);
    });
  });
}
