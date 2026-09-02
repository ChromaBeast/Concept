import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/data.dart';

/// Provider for the daily featured concept pick.
final dailyPickConceptProvider = FutureProvider<Concept?>((ref) async {
  final repo = ref.watch(conceptRepositoryProvider);
  final picks = await repo.getDailyPicks(limit: 1);
  if (picks.isNotEmpty) return picks.first;
  final all = await repo.getConcepts();
  return all.isNotEmpty ? all.first : null;
});

/// Provider for trending/popular concepts.
final trendingConceptsProvider = FutureProvider<List<Concept>>((ref) async {
  final repo = ref.watch(conceptRepositoryProvider);
  final all = await repo.getConcepts();
  final sorted = List<Concept>.from(all)
    ..sort((a, b) => b.viewCount.compareTo(a.viewCount));
  return sorted.take(6).toList();
});

/// Provider for courses the user has started and is continuing.
final inProgressCoursesProvider =
    FutureProvider<List<CourseProgressInfo>>((ref) async {
  final courseRepo = ref.watch(courseRepositoryProvider);
  final userId = ref.watch(currentUserIdProvider);
  // Watch profile changes to reactively update course progress
  ref.watch(userProfileNotifierProvider);
  final allProgress = await courseRepo.getAllCoursesWithProgress(userId);
  return allProgress.where((p) => p.isStarted && !p.isCompleted).toList();
});

/// Provider listing all available categories.
final categoriesListProvider = Provider<List<Category>>((ref) {
  return Category.values;
});
