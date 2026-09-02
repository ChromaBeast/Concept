import '../../core/utils/word_counter.dart';
import '../models/models.dart';
import '../services/appwrite_service.dart';
import '../services/cache_service.dart';

/// Repository managing admin workflows: review queues and image generation.
class AdminRepository {
  AdminRepository({
    required this.cacheService,
    this.appwriteService,
  });

  final CacheService cacheService;
  // ignore: unused_field
  final AppwriteService? appwriteService;

  /// Retrieves concepts requiring editorial or quality review.
  Future<List<Concept>> getNeedsReviewConcepts() async {
    final concepts = cacheService.getConcepts();
    return concepts.where((c) {
      final isNeedsReview = c.status == ContentStatus.needsReview;
      final hasReasons =
          c.needsReviewReasons != null && c.needsReviewReasons!.isNotEmpty;
      return isNeedsReview || hasReasons;
    }).toList();
  }

  /// Retrieves concepts queued for hero image generation.
  Future<List<Concept>> getImageQueue() async {
    final concepts = cacheService.getConcepts();
    return concepts.where((c) {
      final needsVisual = c.visualAid;
      final missingImage = c.heroImageUrl == null || c.heroImageUrl!.isEmpty;
      return needsVisual && missingImage;
    }).toList();
  }

  /// Updates the hero image URL for a concept.
  Future<Concept?> updateHeroImageUrl(
    String conceptId,
    String heroImageUrl,
  ) async {
    final concept = cacheService.getConcept(conceptId);
    if (concept == null) return null;

    final updated = concept.copyWith(
      heroImageUrl: heroImageUrl,
      visualAid: true,
      updatedAt: DateTime.now(),
    );
    await cacheService.saveConcept(updated);
    return updated;
  }

  /// Re-validates a concept against word budget rules and updates its status.
  Future<Concept?> retryConceptCheck(String conceptId) async {
    final concept = cacheService.getConcept(conceptId);
    if (concept == null) return null;

    final validation = WordCounter.validateConceptBudget(concept.body);
    final isNowValid = validation.isValid;

    final updated = concept.copyWith(
      status: isNowValid ? ContentStatus.published : ContentStatus.needsReview,
      needsReviewReasons: isNowValid ? const [] : validation.issues,
      updatedAt: DateTime.now(),
    );
    await cacheService.saveConcept(updated);
    return updated;
  }

  /// Updates the publication status of a concept.
  Future<Concept?> updateConceptStatus(
    String conceptId,
    ContentStatus status,
  ) async {
    final concept = cacheService.getConcept(conceptId);
    if (concept == null) return null;

    final updated = concept.copyWith(
      status: status,
      updatedAt: DateTime.now(),
    );
    await cacheService.saveConcept(updated);
    return updated;
  }
}
