import 'dart:convert';
import 'package:flutter/foundation.dart' show listEquals;

class DeepDive {
  const DeepDive({
    this.title,
    this.estimatedReadSeconds = 360,
    this.sections = const [],
  });

  final String? title;
  final int estimatedReadSeconds;
  final List<DeepDiveSection> sections;

  DeepDive copyWith({
    String? title,
    int? estimatedReadSeconds,
    List<DeepDiveSection>? sections,
  }) {
    return DeepDive(
      title: title ?? this.title,
      estimatedReadSeconds: estimatedReadSeconds ?? this.estimatedReadSeconds,
      sections: sections ?? this.sections,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'estimatedReadSeconds': estimatedReadSeconds,
      'sections': sections.map((x) => x.toMap()).toList(),
    };
  }

  factory DeepDive.fromMap(Map<String, dynamic> map) {
    return DeepDive(
      title: map['title'] as String?,
      estimatedReadSeconds: map['estimatedReadSeconds'] as int? ?? 360,
      sections: (map['sections'] as List<dynamic>?)
              ?.map((x) => DeepDiveSection.fromMap(x as Map<String, dynamic>))
              .toList() ??
          const [],
    );
  }

  String toJson() => json.encode(toMap());

  factory DeepDive.fromJson(String source) =>
      DeepDive.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is DeepDive &&
        other.title == title &&
        other.estimatedReadSeconds == estimatedReadSeconds &&
        listEquals(other.sections, sections);
  }

  @override
  int get hashCode =>
      title.hashCode ^ estimatedReadSeconds.hashCode ^ Object.hashAll(sections);
}

class DeepDiveSection {
  const DeepDiveSection({
    required this.heading,
    required this.content,
    this.codeSnippet,
  });

  final String heading;
  final String content;
  final String? codeSnippet;

  DeepDiveSection copyWith({
    String? heading,
    String? content,
    String? codeSnippet,
  }) {
    return DeepDiveSection(
      heading: heading ?? this.heading,
      content: content ?? this.content,
      codeSnippet: codeSnippet ?? this.codeSnippet,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'heading': heading,
      'content': content,
      'codeSnippet': codeSnippet,
    };
  }

  factory DeepDiveSection.fromMap(Map<String, dynamic> map) {
    return DeepDiveSection(
      heading: map['heading'] as String? ?? '',
      content: map['content'] as String? ?? '',
      codeSnippet: map['codeSnippet'] as String?,
    );
  }

  String toJson() => json.encode(toMap());

  factory DeepDiveSection.fromJson(String source) =>
      DeepDiveSection.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is DeepDiveSection &&
        other.heading == heading &&
        other.content == content &&
        other.codeSnippet == codeSnippet;
  }

  @override
  int get hashCode =>
      heading.hashCode ^ content.hashCode ^ codeSnippet.hashCode;
}
