import 'dart:convert';
import 'enums.dart';

class Tag {
  const Tag({
    required this.id,
    required this.name,
    required this.slug,
    this.usageCount = 0,
    this.category,
  });

  final String id;
  final String name;
  final String slug;
  final int usageCount;
  final Category? category;

  Tag copyWith({
    String? id,
    String? name,
    String? slug,
    int? usageCount,
    Category? category,
  }) {
    return Tag(
      id: id ?? this.id,
      name: name ?? this.name,
      slug: slug ?? this.slug,
      usageCount: usageCount ?? this.usageCount,
      category: category ?? this.category,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'usageCount': usageCount,
      'category': category?.value,
    };
  }

  factory Tag.fromMap(Map<String, dynamic> map, {String? documentId}) {
    return Tag(
      id: (documentId ?? map['\$id'] ?? map['id'] ?? '') as String,
      name: map['name'] as String? ?? '',
      slug: map['slug'] as String? ?? '',
      usageCount: map['usageCount'] as int? ?? 0,
      category: map['category'] != null
          ? Category.fromValue(map['category'] as String?)
          : null,
    );
  }

  String toJson() => json.encode(toMap());

  factory Tag.fromJson(String source) =>
      Tag.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'Tag(id: $id, name: $name, slug: $slug, '
        'usageCount: $usageCount, category: $category)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Tag &&
        other.id == id &&
        other.name == name &&
        other.slug == slug &&
        other.usageCount == usageCount &&
        other.category == category;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        name.hashCode ^
        slug.hashCode ^
        usageCount.hashCode ^
        (category?.hashCode ?? 0);
  }
}
