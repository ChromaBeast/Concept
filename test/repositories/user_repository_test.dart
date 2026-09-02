import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:concept/data/data.dart';

void main() {
  group('UserRepository Tests', () {
    late Directory tempDir;
    late CacheService cacheService;
    late UserRepository userRepository;

    setUp(() async {
      tempDir = Directory.systemTemp.createTempSync('hive_user_repo_test_');
      Hive.init(tempDir.path);
      cacheService = CacheService();
      await cacheService.init();

      userRepository = UserRepository(cacheService: cacheService);
    });

    tearDown(() async {
      await Hive.close();
      if (tempDir.existsSync()) {
        tempDir.deleteSync(recursive: true);
      }
    });

    test('returns default user profile for new user', () async {
      final profile = await userRepository.getUserProfile('new_user_1');
      expect(profile.userId, 'new_user_1');
      expect(profile.streakCount, 0);
      expect(profile.learnedConceptIds, isEmpty);
      expect(profile.bookmarkedConceptIds, isEmpty);
      expect(profile.themeMode, 'system');
    });

    test('updates and retrieves user profile and theme mode', () async {
      const userId = 'user_custom';
      await userRepository.updateThemeMode(userId, 'dark');

      final profile = await userRepository.getUserProfile(userId);
      expect(profile.themeMode, 'dark');
      expect(cacheService.getThemeMode(), 'dark');
    });

    test('toggles bookmarks and learned concept lists', () async {
      const userId = 'user_learner';

      final b1 = await userRepository.toggleBookmark(userId, 'c-1');
      expect(b1, isTrue);
      expect(await userRepository.getBookmarkedIds(userId), ['c-1']);

      final b2 = await userRepository.toggleBookmark(userId, 'c-1');
      expect(b2, isFalse);
      expect(await userRepository.getBookmarkedIds(userId), isEmpty);

      final l1 = await userRepository.toggleLearned(userId, 'c-2');
      expect(l1, isTrue);
      expect(await userRepository.getLearnedIds(userId), ['c-2']);

      final l2 = await userRepository.toggleLearned(userId, 'c-2');
      expect(l2, isFalse);
      expect(await userRepository.getLearnedIds(userId), isEmpty);
    });

    test('records daily streak on app open', () async {
      const userId = 'user_streak';
      final day1 = DateTime(2026, 9, 1, 9, 0);
      final day2 = DateTime(2026, 9, 2, 10, 0);

      final p1 = await userRepository.recordDailyStreak(userId, date: day1);
      expect(p1.streakCount, 1);

      final p2 = await userRepository.recordDailyStreak(userId, date: day2);
      expect(p2.streakCount, 2);
    });
  });
}
