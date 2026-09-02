import 'package:flutter_test/flutter_test.dart';
import 'package:concept/data/models/models.dart';
import 'package:concept/data/services/streak_calculator.dart';

void main() {
  group('StreakCalculator Tests', () {
    test('starts streak at 1 on first app visit', () {
      const profile = UserProfile(userId: 'u1', streakCount: 0);
      final today = DateTime(2026, 9, 2, 10, 0);

      final result = StreakCalculator.calculateStreak(profile, date: today);

      expect(result.streakCount, 1);
      expect(result.lastActiveDate, today);
    });

    test('maintains streak if active again on same day', () {
      final todayMorning = DateTime(2026, 9, 2, 8, 30);
      final todayEvening = DateTime(2026, 9, 2, 20, 15);
      final profile = UserProfile(
        userId: 'u1',
        streakCount: 5,
        lastActiveDate: todayMorning,
      );

      final result = StreakCalculator.calculateStreak(profile, date: todayEvening);

      expect(result.streakCount, 5);
      expect(result.lastActiveDate, todayEvening);
    });

    test('increments streak if active on consecutive day', () {
      final yesterday = DateTime(2026, 9, 1, 14, 0);
      final today = DateTime(2026, 9, 2, 9, 0);
      final profile = UserProfile(
        userId: 'u1',
        streakCount: 3,
        lastActiveDate: yesterday,
      );

      final result = StreakCalculator.calculateStreak(profile, date: today);

      expect(result.streakCount, 4);
      expect(result.lastActiveDate, today);
    });

    test('resets streak to 1 if user missed a day or more', () {
      final threeDaysAgo = DateTime(2026, 8, 30, 10, 0);
      final today = DateTime(2026, 9, 2, 10, 0);
      final profile = UserProfile(
        userId: 'u1',
        streakCount: 12,
        lastActiveDate: threeDaysAgo,
      );

      final result = StreakCalculator.calculateStreak(profile, date: today);

      expect(result.streakCount, 1);
      expect(result.lastActiveDate, today);
    });
  });
}
