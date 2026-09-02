import 'dart:math';

class SlugUtils {
  const SlugUtils._();

  static final RegExp _nonAlphaNumRegex = RegExp(r'[^a-z0-9\s-]');
  static final RegExp _multiDashRegex = RegExp(r'-+');
  static final RegExp _whitespaceRegex = RegExp(r'\s+');

  /// Converts text into a clean URL-safe slug (e.g. "CAP Theorem" -> "cap-theorem")
  static String toSlug(String text) {
    var slug = text.trim().toLowerCase();
    slug = slug.replaceAll(_nonAlphaNumRegex, '');
    slug = slug.replaceAll(_whitespaceRegex, '-');
    slug = slug.replaceAll(_multiDashRegex, '-');
    if (slug.startsWith('-')) slug = slug.substring(1);
    if (slug.endsWith('-')) slug = slug.substring(0, slug.length - 1);
    return slug;
  }

  /// Normalizes tag for deduplication (lowercase, trim, strip punctuation/dashes)
  static String normalizeTag(String tag) {
    return tag
        .trim()
        .toLowerCase()
        .replaceAll(RegExp(r'[-_]'), ' ')
        .replaceAll(RegExp(r'[^a-z0-9\s]'), '')
        .replaceAll(_whitespaceRegex, ' ')
        .trim();
  }

  /// Computes Levenshtein edit distance between two strings
  static int levenshteinDistance(String s1, String s2) {
    if (s1 == s2) return 0;
    if (s1.isEmpty) return s2.length;
    if (s2.isEmpty) return s1.length;

    List<int> v0 = List<int>.generate(s2.length + 1, (i) => i);
    List<int> v1 = List<int>.filled(s2.length + 1, 0);

    for (int i = 0; i < s1.length; i++) {
      v1[0] = i + 1;
      for (int j = 0; j < s2.length; j++) {
        final cost = (s1[i] == s2[j]) ? 0 : 1;
        v1[j + 1] = min(v1[j] + 1, min(v0[j + 1] + 1, v0[j] + cost));
      }
      for (int j = 0; j <= s2.length; j++) {
        v0[j] = v1[j];
      }
    }
    return v1[s2.length];
  }

  /// Checks if two strings are fuzzy match within given Levenshtein distance
  static bool isFuzzyMatch(
    String s1,
    String s2, {
    int maxDistance = 2,
  }) {
    final n1 = normalizeTag(s1);
    final n2 = normalizeTag(s2);
    if (n1 == n2) return true;
    return levenshteinDistance(n1, n2) <= maxDistance;
  }

  /// Finds best matching tag in existing tags list, if within maxDistance
  static String? findBestMatch(
    String candidate,
    Iterable<String> existingTags, {
    int maxDistance = 2,
  }) {
    final normCandidate = normalizeTag(candidate);
    String? bestMatch;
    int lowestDistance = maxDistance + 1;

    for (final tag in existingTags) {
      final normTag = normalizeTag(tag);
      if (normTag == normCandidate) return tag;

      final dist = levenshteinDistance(normCandidate, normTag);
      if (dist <= maxDistance && dist < lowestDistance) {
        lowestDistance = dist;
        bestMatch = tag;
      }
    }
    return bestMatch;
  }
}
