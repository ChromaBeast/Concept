import 'dart:convert';
import 'package:flutter/foundation.dart' show listEquals;

class UserProfile {
  const UserProfile({
    required this.userId,
    this.streakCount = 0,
    this.lastActiveDate,
    this.learnedConceptIds = const [],
    this.bookmarkedConceptIds = const [],
    this.themeMode = 'system',
  });

  final String userId;
  final int streakCount;
  final DateTime? lastActiveDate;
  final List<String> learnedConceptIds;
  final List<String> bookmarkedConceptIds;
  final String themeMode;

  UserProfile copyWith({
    String? userId,
    int? streakCount,
    DateTime? lastActiveDate,
    List<String>? learnedConceptIds,
    List<String>? bookmarkedConceptIds,
    String? themeMode,
    bool clearLastActiveDate = false,
  }) {
    return UserProfile(
      userId: userId ?? this.userId,
      streakCount: streakCount ?? this.streakCount,
      lastActiveDate: clearLastActiveDate
          ? null
          : (lastActiveDate ?? this.lastActiveDate),
      learnedConceptIds: learnedConceptIds ?? this.learnedConceptIds,
      bookmarkedConceptIds:
          bookmarkedConceptIds ?? this.bookmarkedConceptIds,
      themeMode: themeMode ?? this.themeMode,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'streakCount': streakCount,
      'lastActiveDate': lastActiveDate?.toIso8601String(),
      'learnedConceptIds': learnedConceptIds,
      'bookmarkedConceptIds': bookmarkedConceptIds,
      'themeMode': themeMode,
    };
  }

  factory UserProfile.fromMap(Map<String, dynamic> map, {String? documentId}) {
    return UserProfile(
      userId: (documentId ?? map['\$id'] ?? map['userId'] ?? '') as String,
      streakCount: map['streakCount'] as int? ?? 0,
      lastActiveDate: map['lastActiveDate'] != null
          ? DateTime.tryParse(map['lastActiveDate'] as String)
          : null,
      learnedConceptIds:
          (map['learnedConceptIds'] as List<dynamic>?)?.cast<String>() ??
              const [],
      bookmarkedConceptIds:
          (map['bookmarkedConceptIds'] as List<dynamic>?)?.cast<String>() ??
              const [],
      themeMode: map['themeMode'] as String? ?? 'system',
    );
  }

  String toJson() => json.encode(toMap());

  factory UserProfile.fromJson(String source) =>
      UserProfile.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'UserProfile(userId: $userId, streakCount: $streakCount, '
        'learnedCount: ${learnedConceptIds.length}, '
        'bookmarksCount: ${bookmarkedConceptIds.length})';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is UserProfile &&
        other.userId == userId &&
        other.streakCount == streakCount &&
        other.lastActiveDate == lastActiveDate &&
        listEquals(other.learnedConceptIds, learnedConceptIds) &&
        listEquals(other.bookmarkedConceptIds, bookmarkedConceptIds) &&
        other.themeMode == themeMode;
  }

  @override
  int get hashCode {
    return userId.hashCode ^
        streakCount.hashCode ^
        (lastActiveDate?.hashCode ?? 0) ^
        Object.hashAll(learnedConceptIds) ^
        Object.hashAll(bookmarkedConceptIds) ^
        themeMode.hashCode;
  }
}
