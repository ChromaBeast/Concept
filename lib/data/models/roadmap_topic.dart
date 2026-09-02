import 'dart:convert';
import 'enums.dart';

class RoadmapTopic {
  const RoadmapTopic({
    required this.id,
    required this.topic,
    required this.category,
    required this.difficulty,
    required this.createdAt,
    this.priority = 0,
    this.status = RoadmapStatus.pending,
    this.source = RoadmapSource.seed,
    this.attempts = 0,
  });

  final String id;
  final String topic;
  final Category category;
  final Difficulty difficulty;
  final int priority;
  final RoadmapStatus status;
  final RoadmapSource source;
  final int attempts;
  final DateTime createdAt;

  RoadmapTopic copyWith({
    String? id,
    String? topic,
    Category? category,
    Difficulty? difficulty,
    int? priority,
    RoadmapStatus? status,
    RoadmapSource? source,
    int? attempts,
    DateTime? createdAt,
  }) {
    return RoadmapTopic(
      id: id ?? this.id,
      topic: topic ?? this.topic,
      category: category ?? this.category,
      difficulty: difficulty ?? this.difficulty,
      priority: priority ?? this.priority,
      status: status ?? this.status,
      source: source ?? this.source,
      attempts: attempts ?? this.attempts,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'topic': topic,
      'category': category.value,
      'difficulty': difficulty.value,
      'priority': priority,
      'status': status.value,
      'source': source.value,
      'attempts': attempts,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory RoadmapTopic.fromMap(Map<String, dynamic> map, {String? documentId}) {
    return RoadmapTopic(
      id: (documentId ?? map['\$id'] ?? map['id'] ?? '') as String,
      topic: map['topic'] as String? ?? '',
      category: Category.fromValue(map['category'] as String?),
      difficulty: Difficulty.fromValue(map['difficulty'] as String?),
      priority: map['priority'] as int? ?? 0,
      status: RoadmapStatus.fromValue(map['status'] as String?),
      source: RoadmapSource.fromValue(map['source'] as String?),
      attempts: map['attempts'] as int? ?? 0,
      createdAt: map['createdAt'] != null
          ? DateTime.tryParse(map['createdAt'] as String) ?? DateTime.now()
          : (map['\$createdAt'] != null
              ? DateTime.tryParse(map['\$createdAt'] as String) ??
                  DateTime.now()
              : DateTime.now()),
    );
  }

  String toJson() => json.encode(toMap());

  factory RoadmapTopic.fromJson(String source) =>
      RoadmapTopic.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'RoadmapTopic(id: $id, topic: $topic, category: $category, '
        'difficulty: $difficulty, status: $status)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is RoadmapTopic &&
        other.id == id &&
        other.topic == topic &&
        other.category == category &&
        other.difficulty == difficulty &&
        other.priority == priority &&
        other.status == status &&
        other.source == source &&
        other.attempts == attempts &&
        other.createdAt == createdAt;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        topic.hashCode ^
        category.hashCode ^
        difficulty.hashCode ^
        priority.hashCode ^
        status.hashCode;
  }
}
