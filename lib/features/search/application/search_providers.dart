import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/data.dart';

/// Current search query string.
final searchQueryProvider = StateProvider<String>((ref) => '');

/// Search results matching current query.
final searchResultsProvider = FutureProvider<List<Concept>>((ref) async {
  final query = ref.watch(searchQueryProvider);
  if (query.trim().isEmpty) return const [];

  final searchRepo = ref.watch(searchRepositoryProvider);
  return searchRepo.searchConcepts(query);
});

/// List of recent search queries.
final recentSearchesProvider = FutureProvider<List<String>>((ref) async {
  final searchRepo = ref.watch(searchRepositoryProvider);
  return searchRepo.getRecentSearches();
});

/// List of popular tags.
final popularTagsProvider = FutureProvider<List<Tag>>((ref) async {
  final tagRepo = ref.watch(tagRepositoryProvider);
  return tagRepo.getPopularTags(limit: 12);
});
