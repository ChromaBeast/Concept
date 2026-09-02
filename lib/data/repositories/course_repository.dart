import '../models/models.dart';
import '../services/cache_service.dart';
import 'user_repository.dart';

/// Repository handling course retrieval and progress tracking.
class CourseRepository {
  CourseRepository({
    required this.cacheService,
    required this.userRepository,
  });

  final CacheService cacheService;
  final UserRepository userRepository;

  /// Fetches courses with optional category and difficulty filtering.
  Future<List<Course>> getCourses({
    Category? category,
    Difficulty? difficulty,
    ContentStatus? status = ContentStatus.published,
  }) async {
    final cached = cacheService.getCourses();
    return cached.where((course) {
      if (status != null && course.status != status) return false;
      if (category != null && course.primaryCategory != category) return false;
      if (difficulty != null && course.difficulty != difficulty) return false;
      return true;
    }).toList();
  }

  /// Gets a course by its unique ID.
  Future<Course?> getCourseById(String id) async {
    return cacheService.getCourse(id);
  }

  /// Gets a course by its slug.
  Future<Course?> getCourseBySlug(String slug) async {
    return cacheService.getCourseBySlug(slug);
  }

  /// Computes the course progress for a given user.
  Future<CourseProgressInfo?> getCourseProgress(
    String userId,
    String courseId,
  ) async {
    final course = cacheService.getCourse(courseId);
    if (course == null) return null;

    final learnedIds = await userRepository.getLearnedIds(userId);
    return CourseProgressInfo.calculate(
      course: course,
      learnedConceptIds: learnedIds.toSet(),
    );
  }

  /// Retrieves progress for all published courses for a given user.
  Future<List<CourseProgressInfo>> getAllCoursesWithProgress(
    String userId,
  ) async {
    final courses = await getCourses();
    final learnedIds = (await userRepository.getLearnedIds(userId)).toSet();

    return courses
        .map(
          (c) => CourseProgressInfo.calculate(
            course: c,
            learnedConceptIds: learnedIds,
          ),
        )
        .toList();
  }

  /// Marks a course as started and increments startedCount.
  Future<void> startCourse(String courseId) async {
    final course = cacheService.getCourse(courseId);
    if (course != null) {
      final updated =
          course.copyWith(startedCount: course.startedCount + 1);
      await cacheService.saveCourse(updated);
    }
  }
}
