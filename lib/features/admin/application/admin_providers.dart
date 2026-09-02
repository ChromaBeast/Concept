import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/data.dart';

/// Provider fetching all concepts that need editorial or word-budget review.
final needsReviewConceptsProvider =
    FutureProvider<List<Concept>>((ref) async {
  final adminRepo = ref.watch(adminRepositoryProvider);
  return adminRepo.getNeedsReviewConcepts();
});

/// Provider fetching all concepts queued for hero image generation.
final imageQueueConceptsProvider = FutureProvider<List<Concept>>((ref) async {
  final adminRepo = ref.watch(adminRepositoryProvider);
  return adminRepo.getImageQueue();
});
