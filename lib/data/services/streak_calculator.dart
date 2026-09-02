import '../models/user_profile.dart';

/// Utility calculating daily learning streak progression.
class StreakCalculator {
  const StreakCalculator._();

  /// Calculates the updated [UserProfile] with streak progression.
  static UserProfile calculateStreak(UserProfile current, {DateTime? date}) {
    final now = date ?? DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final last = current.lastActiveDate;

    int newStreak = current.streakCount;
    if (last == null) {
      newStreak = 1;
    } else {
      final lastDay = DateTime(last.year, last.month, last.day);
      final diff = today.difference(lastDay).inDays;
      if (diff == 1) {
        newStreak += 1;
      } else if (diff > 1) {
        newStreak = 1;
      }
    }

    return current.copyWith(
      streakCount: newStreak,
      lastActiveDate: now,
    );
  }
}
