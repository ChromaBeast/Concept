import 'dart:convert';

class CourseProgress {
  const CourseProgress({
    required this.courseId,
    required this.startedAt,
    this.completedAt,
  });

  final String courseId;
  final DateTime startedAt;
  final DateTime? completedAt;

  bool get isCompleted => completedAt != null;

  CourseProgress copyWith({
    String? courseId,
    DateTime? startedAt,
    DateTime? completedAt,
    bool clearCompletedAt = false,
  }) {
    return CourseProgress(
      courseId: courseId ?? this.courseId,
      startedAt: startedAt ?? this.startedAt,
      completedAt:
          clearCompletedAt ? null : (completedAt ?? this.completedAt),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'courseId': courseId,
      'startedAt': startedAt.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
    };
  }

  factory CourseProgress.fromMap(Map<String, dynamic> map, {String? documentId}) {
    return CourseProgress(
      courseId: (documentId ?? map['\$id'] ?? map['courseId'] ?? '') as String,
      startedAt: map['startedAt'] != null
          ? DateTime.tryParse(map['startedAt'] as String) ?? DateTime.now()
          : (map['\$createdAt'] != null
              ? DateTime.tryParse(map['\$createdAt'] as String) ?? DateTime.now()
              : DateTime.now()),
      completedAt: map['completedAt'] != null
          ? DateTime.tryParse(map['completedAt'] as String)
          : null,
    );
  }

  String toJson() => json.encode(toMap());

  factory CourseProgress.fromJson(String source) =>
      CourseProgress.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'CourseProgress(courseId: $courseId, startedAt: $startedAt, '
        'completedAt: $completedAt)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is CourseProgress &&
        other.courseId == courseId &&
        other.startedAt == startedAt &&
        other.completedAt == completedAt;
  }

  @override
  int get hashCode =>
      courseId.hashCode ^ startedAt.hashCode ^ (completedAt?.hashCode ?? 0);
}
