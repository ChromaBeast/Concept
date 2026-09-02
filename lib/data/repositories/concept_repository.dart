import '../models/models.dart';
import '../services/appwrite_service.dart';
import '../services/cache_service.dart';
import 'user_repository.dart';

/// Repository handling concept fetching, caching, bookmarking, and learning.
class ConceptRepository {
  ConceptRepository({
    required this.cacheService,
    required this.userRepository,
    this.appwriteService,
  });

  final CacheService cacheService;
  final UserRepository userRepository;
  // ignore: unused_field
  final AppwriteService? appwriteService;

  /// Fetches concepts with optional filters (category, tag, difficulty, status).
  Future<List<Concept>> getConcepts({
    Category? category,
    String? tagId,
    Difficulty? difficulty,
    ContentStatus? status = ContentStatus.published,
  }) async {
    final cached = cacheService.getConcepts();
    return cached.where((c) {
      if (status != null && c.status != status) return false;
      if (category != null && c.category != category) return false;
      if (tagId != null && !c.tagIds.contains(tagId)) return false;
      if (difficulty != null && c.difficulty != difficulty) return false;
      return true;
    }).toList();
  }

  /// Gets a concept by its unique ID.
  Future<Concept?> getConceptById(String id) async {
    return cacheService.getConcept(id);
  }

  /// Gets a concept by its slug.
  Future<Concept?> getConceptBySlug(String slug) async {
    return cacheService.getConceptBySlug(slug);
  }

  /// Toggles bookmark status for a user and updates concept bookmark count.
  Future<bool> toggleBookmark(String userId, String conceptId) async {
    final isBookmarked =
        await userRepository.toggleBookmark(userId, conceptId);
    final concept = cacheService.getConcept(conceptId);
    if (concept != null) {
      final delta = isBookmarked ? 1 : -1;
      final newCount = (concept.bookmarkCount + delta).clamp(0, 999999);
      final updated = concept.copyWith(bookmarkCount: newCount);
      await cacheService.saveConcept(updated);
    }
    return isBookmarked;
  }

  /// Marks a concept as learned for the given user.
  Future<bool> markAsLearned(String userId, String conceptId) async {
    return userRepository.toggleLearned(userId, conceptId);
  }

  /// Increments the local view count of a concept.
  Future<void> incrementViewCount(String conceptId) async {
    final concept = cacheService.getConcept(conceptId);
    if (concept != null) {
      final updated = concept.copyWith(viewCount: concept.viewCount + 1);
      await cacheService.saveConcept(updated);
    }
  }

  /// Retrieves list of all bookmarked concepts for a user.
  Future<List<Concept>> getBookmarkedConcepts(String userId) async {
    final ids = await userRepository.getBookmarkedIds(userId);
    final idSet = ids.toSet();
    return cacheService
        .getConcepts()
        .where((c) => idSet.contains(c.id))
        .toList();
  }

  /// Retrieves list of all learned concepts for a user.
  Future<List<Concept>> getLearnedConcepts(String userId) async {
    final ids = await userRepository.getLearnedIds(userId);
    final idSet = ids.toSet();
    return cacheService
        .getConcepts()
        .where((c) => idSet.contains(c.id))
        .toList();
  }

  /// Retrieves related concepts for a given concept.
  Future<List<Concept>> getRelatedConcepts(String conceptId) async {
    final concept = cacheService.getConcept(conceptId);
    if (concept == null || concept.relatedConceptIds.isEmpty) return const [];
    final relatedSet = concept.relatedConceptIds.toSet();
    return cacheService
        .getConcepts()
        .where((c) => relatedSet.contains(c.id))
        .toList();
  }

  /// Retrieves daily pick / featured concepts.
  Future<List<Concept>> getDailyPicks({int limit = 5}) async {
    final concepts = cacheService
        .getConcepts()
        .where((c) => c.status == ContentStatus.published)
        .toList();
    if (concepts.length <= limit) return concepts;
    return concepts.sublist(0, limit);
  }
}
