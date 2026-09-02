import 'package:hive_flutter/hive_flutter.dart';
import '../../core/constants/app_constants.dart';
import '../models/models.dart';
import 'cache_keys.dart';
import 'streak_calculator.dart';

/// Local storage service powered by Hive for offline caching.
class CacheService {
  CacheService({
    this.conceptsBox,
    this.coursesBox,
    this.tagsBox,
    this.userProfilesBox,
    this.recentSearchesBox,
    this.appSettingsBox,
  });

  Box<String>? conceptsBox;
  Box<String>? coursesBox;
  Box<String>? tagsBox;
  Box<String>? userProfilesBox;
  Box<dynamic>? recentSearchesBox;
  Box<dynamic>? appSettingsBox;

  Future<void> init({HiveInterface? hiveInstance}) async {
    final hive = hiveInstance ?? Hive;
    conceptsBox ??= await hive.openBox<String>(CacheKeys.conceptsBox);
    coursesBox ??= await hive.openBox<String>(CacheKeys.coursesBox);
    tagsBox ??= await hive.openBox<String>(CacheKeys.tagsBox);
    userProfilesBox ??= await hive.openBox<String>(CacheKeys.userProfilesBox);
    recentSearchesBox ??=
        await hive.openBox<dynamic>(CacheKeys.recentSearchesBox);
    appSettingsBox ??= await hive.openBox<dynamic>(CacheKeys.appSettingsBox);
  }

  // --- Concepts ---
  Future<void> saveConcepts(List<Concept> list) async {
    await conceptsBox?.putAll({for (final c in list) c.id: c.toJson()});
  }

  Future<void> saveConcept(Concept concept) async {
    await conceptsBox?.put(concept.id, concept.toJson());
  }

  List<Concept> getConcepts() {
    return conceptsBox?.values.map((e) => Concept.fromJson(e)).toList() ??
        const [];
  }

  Concept? getConcept(String id) {
    final json = conceptsBox?.get(id);
    return json != null ? Concept.fromJson(json) : null;
  }

  Concept? getConceptBySlug(String slug) {
    for (final json in conceptsBox?.values ?? <String>[]) {
      final c = Concept.fromJson(json);
      if (c.slug == slug) return c;
    }
    return null;
  }

  // --- Courses ---
  Future<void> saveCourses(List<Course> list) async {
    await coursesBox?.putAll({for (final c in list) c.id: c.toJson()});
  }

  Future<void> saveCourse(Course course) async {
    await coursesBox?.put(course.id, course.toJson());
  }

  List<Course> getCourses() {
    return coursesBox?.values.map((e) => Course.fromJson(e)).toList() ??
        const [];
  }

  Course? getCourse(String id) {
    final json = coursesBox?.get(id);
    return json != null ? Course.fromJson(json) : null;
  }

  Course? getCourseBySlug(String slug) {
    for (final json in coursesBox?.values ?? <String>[]) {
      final c = Course.fromJson(json);
      if (c.slug == slug) return c;
    }
    return null;
  }

  // --- Tags ---
  Future<void> saveTags(List<Tag> list) async {
    await tagsBox?.putAll({for (final t in list) t.id: t.toJson()});
  }

  Future<void> saveTag(Tag tag) async {
    await tagsBox?.put(tag.id, tag.toJson());
  }

  List<Tag> getTags() {
    return tagsBox?.values.map((e) => Tag.fromJson(e)).toList() ?? const [];
  }

  Tag? getTag(String id) {
    final json = tagsBox?.get(id);
    return json != null ? Tag.fromJson(json) : null;
  }

  // --- User Profile & Streaks ---
  UserProfile getUserProfile(String userId) {
    final json = userProfilesBox?.get(userId);
    return json != null ? UserProfile.fromJson(json) : UserProfile(userId: userId);
  }

  Future<void> saveUserProfile(UserProfile profile) async {
    await userProfilesBox?.put(profile.userId, profile.toJson());
  }

  Future<UserProfile> recordDailyStreak(String userId, {DateTime? date}) async {
    final current = getUserProfile(userId);
    final updated = StreakCalculator.calculateStreak(current, date: date);
    await saveUserProfile(updated);
    return updated;
  }

  // --- Recent Searches ---
  List<String> getRecentSearches() {
    final list = recentSearchesBox?.get(CacheKeys.keyRecentSearches);
    return list is List ? list.cast<String>() : const [];
  }

  Future<void> addRecentSearch(String query) async {
    final trimmed = query.trim();
    if (trimmed.isEmpty) return;
    final current = getRecentSearches().toList();
    current.removeWhere((e) => e.toLowerCase() == trimmed.toLowerCase());
    current.insert(0, trimmed);
    if (current.length > AppConstants.maxRecentSearches) {
      current.removeRange(AppConstants.maxRecentSearches, current.length);
    }
    await recentSearchesBox?.put(CacheKeys.keyRecentSearches, current);
  }

  Future<void> removeRecentSearch(String query) async {
    final current = getRecentSearches().toList();
    current.removeWhere((e) => e.toLowerCase() == query.trim().toLowerCase());
    await recentSearchesBox?.put(CacheKeys.keyRecentSearches, current);
  }

  Future<void> clearRecentSearches() async {
    await recentSearchesBox?.delete(CacheKeys.keyRecentSearches);
  }

  // --- App Settings ---
  bool isSeeded() {
    return appSettingsBox?.get(CacheKeys.keyIsSeeded, defaultValue: false) ==
        true;
  }

  Future<void> setSeeded(bool value) async {
    await appSettingsBox?.put(CacheKeys.keyIsSeeded, value);
  }

  String getThemeMode() {
    return appSettingsBox?.get(
          CacheKeys.keyThemeMode,
          defaultValue: 'system',
        ) as String? ??
        'system';
  }

  Future<void> setThemeMode(String themeMode) async {
    await appSettingsBox?.put(CacheKeys.keyThemeMode, themeMode);
  }

  Future<void> clearAll() async {
    await Future.wait([
      conceptsBox?.clear() ?? Future.value(),
      coursesBox?.clear() ?? Future.value(),
      tagsBox?.clear() ?? Future.value(),
      userProfilesBox?.clear() ?? Future.value(),
      recentSearchesBox?.clear() ?? Future.value(),
      appSettingsBox?.clear() ?? Future.value(),
    ]);
  }
}
