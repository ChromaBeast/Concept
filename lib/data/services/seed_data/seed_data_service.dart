import '../../models/models.dart';
import '../cache_service.dart';
import 'seed_concepts_dsa.dart';
import 'seed_concepts_os_networking.dart';
import 'seed_concepts_patterns_devops.dart';
import 'seed_concepts_system_design.dart';
import 'seed_courses.dart';
import 'seed_tags.dart';

/// Aggregation service managing high-quality offline seed data.
class SeedDataService {
  const SeedDataService();

  List<Tag> get allTags => seedTags;

  List<Concept> get allConcepts => [
        ...seedConceptsDsa,
        ...seedConceptsSystemDesign,
        ...seedConceptsOsNetworking,
        ...seedConceptsPatternsDevops,
      ];

  List<Course> get allCourses => seedCourses;

  /// Loads the entire seed dataset into [CacheService] if not already seeded.
  Future<void> seedIfEmpty(
    CacheService cacheService, {
    bool force = false,
  }) async {
    if (!force && cacheService.isSeeded()) {
      return;
    }

    await Future.wait([
      cacheService.saveTags(allTags),
      cacheService.saveConcepts(allConcepts),
      cacheService.saveCourses(allCourses),
    ]);

    await cacheService.setSeeded(true);
  }
}
