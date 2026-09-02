import '../models/models.dart';
import '../services/cache_service.dart';

/// Repository managing user profile, learning streaks, bookmarks, and settings.
class UserRepository {
  UserRepository({
    required this.cacheService,
  });

  final CacheService cacheService;

  /// Retrieves user profile by userId.
  Future<UserProfile> getUserProfile(String userId) async {
    return cacheService.getUserProfile(userId);
  }

  /// Updates or saves a user profile.
  Future<UserProfile> updateProfile(UserProfile profile) async {
    await cacheService.saveUserProfile(profile);
    return profile;
  }

  /// Records daily app visit and updates streak.
  Future<UserProfile> recordDailyStreak(
    String userId, {
    DateTime? date,
  }) async {
    return cacheService.recordDailyStreak(userId, date: date);
  }

  /// Retrieves the list of bookmarked concept IDs for a user.
  Future<List<String>> getBookmarkedIds(String userId) async {
    final profile = cacheService.getUserProfile(userId);
    return profile.bookmarkedConceptIds;
  }

  /// Retrieves the list of learned concept IDs for a user.
  Future<List<String>> getLearnedIds(String userId) async {
    final profile = cacheService.getUserProfile(userId);
    return profile.learnedConceptIds;
  }

  /// Updates the theme mode setting in user profile and global settings.
  Future<void> updateThemeMode(String userId, String themeMode) async {
    final profile = cacheService.getUserProfile(userId);
    final updated = profile.copyWith(themeMode: themeMode);
    await Future.wait([
      cacheService.saveUserProfile(updated),
      cacheService.setThemeMode(themeMode),
    ]);
  }

  /// Toggles whether a concept is bookmarked. Returns true if bookmarked.
  Future<bool> toggleBookmark(String userId, String conceptId) async {
    final profile = cacheService.getUserProfile(userId);
    final bookmarks = profile.bookmarkedConceptIds.toList();
    final isBookmarked = bookmarks.contains(conceptId);

    if (isBookmarked) {
      bookmarks.remove(conceptId);
    } else {
      bookmarks.add(conceptId);
    }

    final updated = profile.copyWith(bookmarkedConceptIds: bookmarks);
    await cacheService.saveUserProfile(updated);
    return !isBookmarked;
  }

  /// Toggles whether a concept is marked as learned. Returns true if learned.
  Future<bool> toggleLearned(String userId, String conceptId) async {
    final profile = cacheService.getUserProfile(userId);
    final learned = profile.learnedConceptIds.toList();
    final isLearned = learned.contains(conceptId);

    if (isLearned) {
      learned.remove(conceptId);
    } else {
      learned.add(conceptId);
    }

    final updated = profile.copyWith(learnedConceptIds: learned);
    await cacheService.saveUserProfile(updated);
    return !isLearned;
  }
}
