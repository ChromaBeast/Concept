import 'dart:convert';
import 'package:flutter/foundation.dart' show listEquals;
import 'enums.dart';

class Course {
  const Course({
    required this.id,
    required this.slug,
    required this.title,
    required this.description,
    required this.primaryCategory,
    required this.difficulty,
    required this.createdAt,
    required this.updatedAt,
    this.conceptIds = const [],
    this.totalReadSeconds = 0,
    this.coverImageUrl,
    this.status = ContentStatus.draft,
    this.source = ContentSource.aiCurated,
    this.startedCount = 0,
    this.completedCount = 0,
  });

  final String id;
  final String slug;
  final String title;
  final String description;
  final Category primaryCategory;
  final Difficulty difficulty;
  final List<String> conceptIds;
  final int totalReadSeconds;
  final String? coverImageUrl;
  final ContentStatus status;
  final ContentSource source;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int startedCount;
  final int completedCount;

  Course copyWith({
    String? id,
    String? slug,
    String? title,
    String? description,
    Category? primaryCategory,
    Difficulty? difficulty,
    List<String>? conceptIds,
    int? totalReadSeconds,
    String? coverImageUrl,
    ContentStatus? status,
    ContentSource? source,
    DateTime? createdAt,
    DateTime? updatedAt,
    int? startedCount,
    int? completedCount,
  }) {
    return Course(
      id: id ?? this.id,
      slug: slug ?? this.slug,
      title: title ?? this.title,
      description: description ?? this.description,
      primaryCategory: primaryCategory ?? this.primaryCategory,
      difficulty: difficulty ?? this.difficulty,
      conceptIds: conceptIds ?? this.conceptIds,
      totalReadSeconds: totalReadSeconds ?? this.totalReadSeconds,
      coverImageUrl: coverImageUrl ?? this.coverImageUrl,
      status: status ?? this.status,
      source: source ?? this.source,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      startedCount: startedCount ?? this.startedCount,
      completedCount: completedCount ?? this.completedCount,
    );
  }

  Map<String, dynamic> toMap() => {
        'id': id,
        'slug': slug,
        'title': title,
        'description': description,
        'primaryCategory': primaryCategory.value,
        'difficulty': difficulty.value,
        'conceptIds': conceptIds,
        'totalReadSeconds': totalReadSeconds,
        'coverImageUrl': coverImageUrl,
        'status': status.value,
        'source': source.value,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
        'startedCount': startedCount,
        'completedCount': completedCount,
      };

  factory Course.fromMap(Map<String, dynamic> map, {String? documentId}) {
    return Course(
      id: (documentId ?? map['\$id'] ?? map['id'] ?? '') as String,
      slug: map['slug'] as String? ?? '',
      title: map['title'] as String? ?? '',
      description: map['description'] as String? ?? '',
      primaryCategory: Category.fromValue(map['primaryCategory'] as String?),
      difficulty: Difficulty.fromValue(map['difficulty'] as String?),
      conceptIds: (map['conceptIds'] as List<dynamic>?)?.cast<String>() ?? const [],
      totalReadSeconds: map['totalReadSeconds'] as int? ?? 0,
      coverImageUrl: map['coverImageUrl'] as String?,
      status: ContentStatus.fromValue(map['status'] as String?),
      source: ContentSource.fromValue(map['source'] as String?),
      createdAt: map['createdAt'] != null
          ? DateTime.tryParse(map['createdAt'] as String) ?? DateTime.now()
          : (map['\$createdAt'] != null
              ? DateTime.tryParse(map['\$createdAt'] as String) ?? DateTime.now()
              : DateTime.now()),
      updatedAt: map['updatedAt'] != null
          ? DateTime.tryParse(map['updatedAt'] as String) ?? DateTime.now()
          : (map['\$updatedAt'] != null
              ? DateTime.tryParse(map['\$updatedAt'] as String) ?? DateTime.now()
              : DateTime.now()),
      startedCount: map['startedCount'] as int? ?? 0,
      completedCount: map['completedCount'] as int? ?? 0,
    );
  }

  String toJson() => json.encode(toMap());

  factory Course.fromJson(String source) =>
      Course.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() => 'Course(id: $id, slug: $slug, title: $title, category: $primaryCategory)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Course &&
        other.id == id &&
        other.slug == slug &&
        other.title == title &&
        other.description == description &&
        other.primaryCategory == primaryCategory &&
        other.difficulty == difficulty &&
        listEquals(other.conceptIds, conceptIds) &&
        other.totalReadSeconds == totalReadSeconds &&
        other.coverImageUrl == coverImageUrl &&
        other.status == status &&
        other.source == source &&
        other.startedCount == startedCount &&
        other.completedCount == completedCount;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        slug.hashCode ^
        title.hashCode ^
        primaryCategory.hashCode ^
        difficulty.hashCode;
  }
}
