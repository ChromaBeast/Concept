import 'dart:convert';
import 'package:flutter/foundation.dart' show listEquals;

class PipelineRun {
  const PipelineRun({
    required this.id,
    required this.startedAt,
    this.finishedAt,
    this.attempted = 0,
    this.published = 0,
    this.needsReview = 0,
    this.errors = const [],
  });

  final String id;
  final DateTime startedAt;
  final DateTime? finishedAt;
  final int attempted;
  final int published;
  final int needsReview;
  final List<String> errors;

  PipelineRun copyWith({
    String? id,
    DateTime? startedAt,
    DateTime? finishedAt,
    int? attempted,
    int? published,
    int? needsReview,
    List<String>? errors,
    bool clearFinishedAt = false,
  }) {
    return PipelineRun(
      id: id ?? this.id,
      startedAt: startedAt ?? this.startedAt,
      finishedAt:
          clearFinishedAt ? null : (finishedAt ?? this.finishedAt),
      attempted: attempted ?? this.attempted,
      published: published ?? this.published,
      needsReview: needsReview ?? this.needsReview,
      errors: errors ?? this.errors,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'startedAt': startedAt.toIso8601String(),
      'finishedAt': finishedAt?.toIso8601String(),
      'attempted': attempted,
      'published': published,
      'needsReview': needsReview,
      'errors': errors,
    };
  }

  factory PipelineRun.fromMap(Map<String, dynamic> map, {String? documentId}) {
    return PipelineRun(
      id: (documentId ?? map['\$id'] ?? map['id'] ?? '') as String,
      startedAt: map['startedAt'] != null
          ? DateTime.tryParse(map['startedAt'] as String) ?? DateTime.now()
          : (map['\$createdAt'] != null
              ? DateTime.tryParse(map['\$createdAt'] as String) ??
                  DateTime.now()
              : DateTime.now()),
      finishedAt: map['finishedAt'] != null
          ? DateTime.tryParse(map['finishedAt'] as String)
          : null,
      attempted: map['attempted'] as int? ?? 0,
      published: map['published'] as int? ?? 0,
      needsReview: map['needsReview'] as int? ?? 0,
      errors: (map['errors'] as List<dynamic>?)?.cast<String>() ?? const [],
    );
  }

  String toJson() => json.encode(toMap());

  factory PipelineRun.fromJson(String source) =>
      PipelineRun.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'PipelineRun(id: $id, attempted: $attempted, published: $published, '
        'needsReview: $needsReview, errors: ${errors.length})';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is PipelineRun &&
        other.id == id &&
        other.startedAt == startedAt &&
        other.finishedAt == finishedAt &&
        other.attempted == attempted &&
        other.published == published &&
        other.needsReview == needsReview &&
        listEquals(other.errors, errors);
  }

  @override
  int get hashCode {
    return id.hashCode ^
        startedAt.hashCode ^
        (finishedAt?.hashCode ?? 0) ^
        attempted.hashCode ^
        published.hashCode ^
        needsReview.hashCode ^
        Object.hashAll(errors);
  }
}
