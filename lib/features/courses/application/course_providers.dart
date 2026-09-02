import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/data.dart';

/// Currently selected category filter for the courses catalog.
final courseCategoryFilterProvider = StateProvider<Category?>((ref) => null);

/// List of all courses paired with the current user's progress.
final allCoursesProgressProvider =
    FutureProvider<List<CourseProgressInfo>>((ref) async {
  final courseRepo = ref.watch(courseRepositoryProvider);
  final userId = ref.watch(currentUserIdProvider);
  // Re-run when user profile updates (e.g. concept learned)
  ref.watch(userProfileNotifierProvider);
  return courseRepo.getAllCoursesWithProgress(userId);
});

/// Progress info for a specific course by ID.
final singleCourseProgressProvider =
    FutureProvider.family<CourseProgressInfo?, String>((ref, courseId) async {
  final courseRepo = ref.watch(courseRepositoryProvider);
  final userId = ref.watch(currentUserIdProvider);
  ref.watch(userProfileNotifierProvider);
  return courseRepo.getCourseProgress(userId, courseId);
});

/// Ordered list of Concept objects belonging to a specific course.
final courseConceptsProvider =
    FutureProvider.family<List<Concept>, String>((ref, courseId) async {
  final courseRepo = ref.watch(courseRepositoryProvider);
  final conceptRepo = ref.watch(conceptRepositoryProvider);
  final course = await courseRepo.getCourseById(courseId);
  if (course == null) return const [];

  final concepts = <Concept>[];
  for (final id in course.conceptIds) {
    final c = await conceptRepo.getConceptById(id);
    if (c != null) {
      concepts.add(c);
    }
  }
  return concepts;
});
