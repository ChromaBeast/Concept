import '../../core/utils/slug_utils.dart';
import '../models/models.dart';
import '../services/cache_service.dart';

/// Repository for concept searching with ranking and recent search history.
class SearchRepository {
  SearchRepository({
    required this.cacheService,
  });

  final CacheService cacheService;

  /// Searches concepts with relevance ranking and fuzzy matching fallback.
  Future<List<Concept>> searchConcepts(
    String query, {
    Category? category,
    Difficulty? difficulty,
    ContentStatus status = ContentStatus.published,
  }) async {
    final cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.isEmpty) return const [];

    final allConcepts = cacheService.getConcepts().where((c) {
      if (c.status != status) return false;
      if (category != null && c.category != category) return false;
      if (difficulty != null && c.difficulty != difficulty) return false;
      return true;
    }).toList();

    final allTags = cacheService.getTags();
    final tagMap = {for (final t in allTags) t.id: t};

    final exactMatches = <Concept>[];
    final titleMatches = <Concept>[];
    final tagMatches = <Concept>[];
    final bodyMatches = <Concept>[];
    final fuzzyMatches = <Concept>[];

    for (final c in allConcepts) {
      final title = c.title.toLowerCase();
      final oneLiner = c.oneLiner.toLowerCase();
      final slug = c.slug.toLowerCase();

      final conceptTagNames = c.tagIds
          .map((id) => tagMap[id]?.name.toLowerCase() ?? id.toLowerCase())
          .toList();

      final titleWords = title.split(RegExp(r'[\s-_]+'));
      final tagWords = conceptTagNames.expand((t) => t.split(RegExp(r'[\s-_]+'))).toList();

      if (title == cleanQuery || slug == cleanQuery) {
        exactMatches.add(c);
      } else if (title.contains(cleanQuery)) {
        titleMatches.add(c);
      } else if (conceptTagNames.any((t) => t.contains(cleanQuery))) {
        tagMatches.add(c);
      } else if (oneLiner.contains(cleanQuery)) {
        bodyMatches.add(c);
      } else if (titleWords.any((w) => SlugUtils.isFuzzyMatch(cleanQuery, w, maxDistance: 2)) ||
          tagWords.any((w) => SlugUtils.isFuzzyMatch(cleanQuery, w, maxDistance: 2))) {
        fuzzyMatches.add(c);
      }
    }

    final combined = <Concept>{
      ...exactMatches,
      ...titleMatches,
      ...tagMatches,
      ...bodyMatches,
      ...fuzzyMatches,
    };

    return combined.toList();
  }

  /// Retrieves list of recent searches from local cache.
  Future<List<String>> getRecentSearches() async {
    return cacheService.getRecentSearches();
  }

  /// Adds a query to recent search history.
  Future<void> addRecentSearch(String query) async {
    await cacheService.addRecentSearch(query);
  }

  /// Removes a single query from recent searches.
  Future<void> removeRecentSearch(String query) async {
    await cacheService.removeRecentSearch(query);
  }

  /// Clears all recent search history.
  Future<void> clearRecentSearches() async {
    await cacheService.clearRecentSearches();
  }
}
