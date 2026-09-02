import 'dart:convert';
import 'package:flutter/foundation.dart' show listEquals;
import 'quick_check.dart';

class ConceptBody {
  const ConceptBody({
    required this.definition,
    required this.whyItMatters,
    required this.example,
    this.commonPitfall,
    this.interviewAngle,
    this.quickChecks = const [],
  });

  final String definition;
  final String whyItMatters;
  final String example;
  final String? commonPitfall;
  final String? interviewAngle;
  final List<QuickCheck> quickChecks;

  ConceptBody copyWith({
    String? definition,
    String? whyItMatters,
    String? example,
    String? commonPitfall,
    String? interviewAngle,
    List<QuickCheck>? quickChecks,
  }) {
    return ConceptBody(
      definition: definition ?? this.definition,
      whyItMatters: whyItMatters ?? this.whyItMatters,
      example: example ?? this.example,
      commonPitfall: commonPitfall ?? this.commonPitfall,
      interviewAngle: interviewAngle ?? this.interviewAngle,
      quickChecks: quickChecks ?? this.quickChecks,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'definition': definition,
      'whyItMatters': whyItMatters,
      'example': example,
      'commonPitfall': commonPitfall,
      'interviewAngle': interviewAngle,
      'quickChecks': quickChecks.map((x) => x.toMap()).toList(),
    };
  }

  factory ConceptBody.fromMap(Map<String, dynamic> map) {
    return ConceptBody(
      definition: map['definition'] as String? ?? '',
      whyItMatters: map['whyItMatters'] as String? ?? '',
      example: map['example'] as String? ?? '',
      commonPitfall: map['commonPitfall'] as String?,
      interviewAngle: map['interviewAngle'] as String?,
      quickChecks: (map['quickChecks'] as List<dynamic>?)
              ?.map((x) => QuickCheck.fromMap(x as Map<String, dynamic>))
              .toList() ??
          const [],
    );
  }

  String toJson() => json.encode(toMap());

  factory ConceptBody.fromJson(String source) =>
      ConceptBody.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'ConceptBody(definition: $definition, whyItMatters: $whyItMatters, '
        'example: $example, commonPitfall: $commonPitfall, '
        'interviewAngle: $interviewAngle, quickChecks: $quickChecks)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ConceptBody &&
        other.definition == definition &&
        other.whyItMatters == whyItMatters &&
        other.example == example &&
        other.commonPitfall == commonPitfall &&
        other.interviewAngle == interviewAngle &&
        listEquals(other.quickChecks, quickChecks);
  }

  @override
  int get hashCode {
    return definition.hashCode ^
        whyItMatters.hashCode ^
        example.hashCode ^
        commonPitfall.hashCode ^
        interviewAngle.hashCode ^
        Object.hashAll(quickChecks);
  }
}
