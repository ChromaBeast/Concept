import 'course.dart';

/// Detailed progress summary for a user in a specific course.
class CourseProgressInfo {
  const CourseProgressInfo({
    required this.course,
    required this.totalConcepts,
    required this.completedConcepts,
    required this.completionPercentage,
    required this.completedConceptIds,
    this.nextConceptId,
    this.isCompleted = false,
    this.isStarted = false,
  });

  final Course course;
  final int totalConcepts;
  final int completedConcepts;
  final double completionPercentage;
  final List<String> completedConceptIds;
  final String? nextConceptId;
  final bool isCompleted;
  final bool isStarted;

  factory CourseProgressInfo.calculate({
    required Course course,
    required Set<String> learnedConceptIds,
  }) {
    final total = course.conceptIds.length;
    if (total == 0) {
      return CourseProgressInfo(
        course: course,
        totalConcepts: 0,
        completedConcepts: 0,
        completionPercentage: 1.0,
        completedConceptIds: const [],
        isCompleted: true,
        isStarted: false,
      );
    }

    final completed = <String>[];
    String? next;

    for (final id in course.conceptIds) {
      if (learnedConceptIds.contains(id)) {
        completed.add(id);
      } else {
        next ??= id;
      }
    }

    final completedCount = completed.length;
    final percentage = (completedCount / total).clamp(0.0, 1.0);

    return CourseProgressInfo(
      course: course,
      totalConcepts: total,
      completedConcepts: completedCount,
      completionPercentage: percentage,
      completedConceptIds: completed,
      nextConceptId: next,
      isCompleted: completedCount == total,
      isStarted: completedCount > 0,
    );
  }

  @override
  String toString() {
    return 'CourseProgressInfo(course: ${course.title}, '
        'progress: $completedConcepts/$totalConcepts '
        '(${(completionPercentage * 100).toStringAsFixed(0)}%))';
  }
}
