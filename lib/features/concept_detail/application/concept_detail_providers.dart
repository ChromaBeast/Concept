import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/data.dart';

/// Provider fetching a single concept by ID and incrementing its local view count.
final singleConceptProvider =
    FutureProvider.family<Concept?, String>((ref, conceptId) async {
  final repo = ref.watch(conceptRepositoryProvider);
  final concept = await repo.getConceptById(conceptId);
  if (concept != null) {
    repo.incrementViewCount(conceptId);
  }
  return concept;
});

/// Provider fetching related concepts for a given concept.
final relatedConceptsProvider =
    FutureProvider.family<List<Concept>, String>((ref, conceptId) async {
  final repo = ref.watch(conceptRepositoryProvider);
  return repo.getRelatedConcepts(conceptId);
});

/// Navigation context for sequential learning within a course track.
class CourseNavInfo {
  const CourseNavInfo({
    this.course,
    this.currentIndex = -1,
    this.totalCount = 0,
    this.previousConceptId,
    this.nextConceptId,
  });

  final Course? course;
  final int currentIndex;
  final int totalCount;
  final String? previousConceptId;
  final String? nextConceptId;

  bool get hasPrevious => previousConceptId != null;
  bool get hasNext => nextConceptId != null;
}

/// Provider computing previous/next course navigation info.
final courseNavProvider =
    FutureProvider.family<CourseNavInfo, ({String conceptId, String? courseId})>(
  (ref, args) async {
    final courseId = args.courseId;
    if (courseId == null || courseId.isEmpty) {
      return const CourseNavInfo();
    }

    final courseRepo = ref.watch(courseRepositoryProvider);
    final course = await courseRepo.getCourseById(courseId);
    if (course == null) return const CourseNavInfo();

    final ids = course.conceptIds;
    final idx = ids.indexOf(args.conceptId);
    if (idx == -1) return CourseNavInfo(course: course);

    final prevId = idx > 0 ? ids[idx - 1] : null;
    final nextId = idx < ids.length - 1 ? ids[idx + 1] : null;

    return CourseNavInfo(
      course: course,
      currentIndex: idx,
      totalCount: ids.length,
      previousConceptId: prevId,
      nextConceptId: nextId,
    );
  },
);
