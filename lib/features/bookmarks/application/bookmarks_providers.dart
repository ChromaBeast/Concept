import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/data.dart';

/// Currently selected category filter on the bookmarks screen.
final bookmarksCategoryFilterProvider = StateProvider<Category?>((ref) => null);

/// Provider fetching all bookmarked concepts for the active user.
final bookmarkedConceptsProvider = FutureProvider<List<Concept>>((ref) async {
  final conceptRepo = ref.watch(conceptRepositoryProvider);
  final userId = ref.watch(currentUserIdProvider);
  // Re-run when profile bookmarks update
  ref.watch(userProfileNotifierProvider);
  return conceptRepo.getBookmarkedConcepts(userId);
});
