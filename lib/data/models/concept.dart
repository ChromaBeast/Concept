import 'dart:convert';
import 'package:flutter/foundation.dart' show listEquals;
import 'concept_body.dart';
import 'enums.dart';

class Concept {
  const Concept({
    required this.id,
    required this.slug,
    required this.title,
    required this.oneLiner,
    required this.category,
    required this.difficulty,
    required this.body,
    required this.estimatedReadSeconds,
    required this.createdAt,
    required this.updatedAt,
    this.tagIds = const [],
    this.status = ContentStatus.draft,
    this.source = ContentSource.aiGenerated,
    this.aiModel,
    this.promptVersion,
    this.relatedConceptIds = const [],
    this.askedByCompanies = const [],
    this.viewCount = 0,
    this.bookmarkCount = 0,
    this.visualAid = false,
    this.heroImageUrl,
    this.imagePrompt,
    this.needsReviewReasons,
  });

  final String id, slug, title, oneLiner;
  final Category category;
  final List<String> tagIds;
  final Difficulty difficulty;
  final ConceptBody body;
  final int estimatedReadSeconds, viewCount, bookmarkCount;
  final ContentStatus status;
  final ContentSource source;
  final String? aiModel, promptVersion, heroImageUrl, imagePrompt;
  final List<String> relatedConceptIds, askedByCompanies;
  final DateTime createdAt, updatedAt;
  final bool visualAid;
  final List<String>? needsReviewReasons;

  Concept copyWith({
    String? id,
    String? slug,
    String? title,
    String? oneLiner,
    Category? category,
    List<String>? tagIds,
    Difficulty? difficulty,
    ConceptBody? body,
    int? estimatedReadSeconds,
    ContentStatus? status,
    ContentSource? source,
    String? aiModel,
    String? promptVersion,
    List<String>? relatedConceptIds,
    List<String>? askedByCompanies,
    DateTime? createdAt,
    DateTime? updatedAt,
    int? viewCount,
    int? bookmarkCount,
    bool? visualAid,
    String? heroImageUrl,
    String? imagePrompt,
    List<String>? needsReviewReasons,
  }) {
    return Concept(
      id: id ?? this.id,
      slug: slug ?? this.slug,
      title: title ?? this.title,
      oneLiner: oneLiner ?? this.oneLiner,
      category: category ?? this.category,
      tagIds: tagIds ?? this.tagIds,
      difficulty: difficulty ?? this.difficulty,
      body: body ?? this.body,
      estimatedReadSeconds: estimatedReadSeconds ?? this.estimatedReadSeconds,
      status: status ?? this.status,
      source: source ?? this.source,
      aiModel: aiModel ?? this.aiModel,
      promptVersion: promptVersion ?? this.promptVersion,
      relatedConceptIds: relatedConceptIds ?? this.relatedConceptIds,
      askedByCompanies: askedByCompanies ?? this.askedByCompanies,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      viewCount: viewCount ?? this.viewCount,
      bookmarkCount: bookmarkCount ?? this.bookmarkCount,
      visualAid: visualAid ?? this.visualAid,
      heroImageUrl: heroImageUrl ?? this.heroImageUrl,
      imagePrompt: imagePrompt ?? this.imagePrompt,
      needsReviewReasons: needsReviewReasons ?? this.needsReviewReasons,
    );
  }

  Map<String, dynamic> toMap() => {
        'id': id,
        'slug': slug,
        'title': title,
        'oneLiner': oneLiner,
        'category': category.value,
        'tagIds': tagIds,
        'difficulty': difficulty.value,
        'body': body.toMap(),
        'estimatedReadSeconds': estimatedReadSeconds,
        'status': status.value,
        'source': source.value,
        'aiModel': aiModel,
        'promptVersion': promptVersion,
        'relatedConceptIds': relatedConceptIds,
        'askedByCompanies': askedByCompanies,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
        'viewCount': viewCount,
        'bookmarkCount': bookmarkCount,
        'visualAid': visualAid,
        'heroImageUrl': heroImageUrl,
        'imagePrompt': imagePrompt,
        'needsReviewReasons': needsReviewReasons,
      };

  factory Concept.fromMap(Map<String, dynamic> map, {String? documentId}) {
    final bodyData = map['body'];
    final parsedBody = bodyData is Map<String, dynamic>
        ? ConceptBody.fromMap(bodyData)
        : (bodyData is String
            ? ConceptBody.fromJson(bodyData)
            : const ConceptBody(definition: '', whyItMatters: '', example: ''));

    DateTime parseDate(dynamic val, [dynamic fallback]) {
      final s = (val ?? fallback)?.toString();
      return s != null ? (DateTime.tryParse(s) ?? DateTime.now()) : DateTime.now();
    }

    return Concept(
      id: (documentId ?? map['\$id'] ?? map['id'] ?? '') as String,
      slug: map['slug'] as String? ?? '',
      title: map['title'] as String? ?? '',
      oneLiner: map['oneLiner'] as String? ?? '',
      category: Category.fromValue(map['category'] as String?),
      tagIds: (map['tagIds'] as List<dynamic>?)?.cast<String>() ?? const [],
      difficulty: Difficulty.fromValue(map['difficulty'] as String?),
      body: parsedBody,
      estimatedReadSeconds: map['estimatedReadSeconds'] as int? ?? 90,
      status: ContentStatus.fromValue(map['status'] as String?),
      source: ContentSource.fromValue(map['source'] as String?),
      aiModel: map['aiModel'] as String?,
      promptVersion: map['promptVersion'] as String?,
      relatedConceptIds: (map['relatedConceptIds'] as List<dynamic>?)?.cast<String>() ?? const [],
      askedByCompanies: (map['askedByCompanies'] as List<dynamic>?)?.cast<String>() ?? const [],
      createdAt: parseDate(map['createdAt'], map['\$createdAt']),
      updatedAt: parseDate(map['updatedAt'], map['\$updatedAt']),
      viewCount: map['viewCount'] as int? ?? 0,
      bookmarkCount: map['bookmarkCount'] as int? ?? 0,
      visualAid: map['visualAid'] as bool? ?? false,
      heroImageUrl: map['heroImageUrl'] as String?,
      imagePrompt: map['imagePrompt'] as String?,
      needsReviewReasons: (map['needsReviewReasons'] as List<dynamic>?)?.cast<String>(),
    );
  }

  String toJson() => json.encode(toMap());

  factory Concept.fromJson(String source) =>
      Concept.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() => 'Concept(id: $id, slug: $slug, title: $title, category: $category)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Concept &&
        other.id == id &&
        other.slug == slug &&
        other.title == title &&
        other.oneLiner == oneLiner &&
        other.category == category &&
        listEquals(other.tagIds, tagIds) &&
        other.difficulty == difficulty &&
        other.body == body &&
        other.estimatedReadSeconds == estimatedReadSeconds &&
        other.status == status &&
        other.source == source &&
        other.aiModel == aiModel &&
        other.promptVersion == promptVersion &&
        listEquals(other.relatedConceptIds, relatedConceptIds) &&
        listEquals(other.askedByCompanies, askedByCompanies) &&
        other.viewCount == viewCount &&
        other.bookmarkCount == bookmarkCount &&
        other.visualAid == visualAid &&
        other.heroImageUrl == heroImageUrl &&
        other.imagePrompt == imagePrompt &&
        listEquals(other.needsReviewReasons, needsReviewReasons);
  }

  @override
  int get hashCode => Object.hash(id, slug, title, category, difficulty);
}
