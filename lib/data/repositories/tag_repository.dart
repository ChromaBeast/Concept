import '../models/models.dart';
import '../services/cache_service.dart';

/// Repository handling tag queries and category tag listings.
class TagRepository {
  TagRepository({
    required this.cacheService,
  });

  final CacheService cacheService;

  /// Retrieves all cached tags.
  Future<List<Tag>> getAllTags() async {
    return cacheService.getTags();
  }

  /// Retrieves tags associated with a specific category.
  Future<List<Tag>> getTagsByCategory(Category category) async {
    final tags = cacheService.getTags();
    return tags.where((t) => t.category == category).toList();
  }

  /// Retrieves a tag by its ID.
  Future<Tag?> getTagById(String id) async {
    return cacheService.getTag(id);
  }

  /// Retrieves a tag by its slug.
  Future<Tag?> getTagBySlug(String slug) async {
    for (final tag in cacheService.getTags()) {
      if (tag.slug == slug) return tag;
    }
    return null;
  }

  /// Retrieves popular tags sorted by usage count descending.
  Future<List<Tag>> getPopularTags({int limit = 10}) async {
    final tags = cacheService.getTags().toList()
      ..sort((a, b) => b.usageCount.compareTo(a.usageCount));
    if (tags.length <= limit) return tags;
    return tags.sublist(0, limit);
  }
}
