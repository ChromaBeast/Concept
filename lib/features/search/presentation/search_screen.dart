import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/router.dart';
import '../../../data/data_providers.dart';
import '../../../shared/widgets/concept_card.dart';
import '../../../shared/widgets/empty_state_view.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../application/search_providers.dart';
import 'widgets/recent_searches_list.dart';
import 'widgets/search_bar_widget.dart';
import 'widgets/trending_tags_grid.dart';

/// Full screen search interface with history and popular tags.
class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({
    super.key,
    this.initialQuery,
  });

  final String? initialQuery;

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  @override
  void initState() {
    super.initState();
    if (widget.initialQuery != null && widget.initialQuery!.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ref.read(searchQueryProvider.notifier).state = widget.initialQuery!;
      });
    }
  }

  void _onSearch(String query) {
    ref.read(searchQueryProvider.notifier).state = query;
    if (query.trim().isNotEmpty) {
      ref.read(searchRepositoryProvider).addRecentSearch(query);
      ref.invalidate(recentSearchesProvider);
    }
  }

  @override
  Widget build(BuildContext context) {
    final query = ref.watch(searchQueryProvider);
    final resultsAsync = ref.watch(searchResultsProvider);
    final recentAsync = ref.watch(recentSearchesProvider);
    final tagsAsync = ref.watch(popularTagsProvider);
    final profileAsync = ref.watch(userProfileNotifierProvider);

    final userProfile = profileAsync.asData?.value;
    final bookmarkedIds = userProfile?.bookmarkedConceptIds.toSet() ?? const {};
    final learnedIds = userProfile?.learnedConceptIds.toSet() ?? const {};

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            SearchBarWidget(
              initialQuery: query,
              onChanged: (val) =>
                  ref.read(searchQueryProvider.notifier).state = val,
              onSubmitted: _onSearch,
              onBack: () => context.pop(),
            ),
            Expanded(
              child: query.trim().isEmpty
                  ? SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          recentAsync.when(
                            data: (recents) => RecentSearchesList(
                              recentSearches: recents,
                              onSearchSelected: _onSearch,
                              onRemoveSearch: (q) async {
                                await ref
                                    .read(searchRepositoryProvider)
                                    .removeRecentSearch(q);
                                ref.invalidate(recentSearchesProvider);
                              },
                              onClearAll: () async {
                                await ref
                                    .read(searchRepositoryProvider)
                                    .clearRecentSearches();
                                ref.invalidate(recentSearchesProvider);
                              },
                            ),
                            loading: () => const SizedBox.shrink(),
                            error: (_, _) => const SizedBox.shrink(),
                          ),
                          tagsAsync.when(
                            data: (tags) => TrendingTagsGrid(
                              tags: tags,
                              onTagSelected: _onSearch,
                            ),
                            loading: () => const SizedBox.shrink(),
                            error: (_, _) => const SizedBox.shrink(),
                          ),
                        ],
                      ),
                    )
                  : resultsAsync.when(
                      data: (results) {
                        if (results.isEmpty) {
                          return const Center(
                            child: EmptyStateView(
                              icon: Icons.search_off_rounded,
                              title: 'No results found',
                              description:
                                  'Try searching for another keyword or concept name.',
                            ),
                          );
                        }

                        return ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: results.length,
                          itemBuilder: (context, index) {
                            final concept = results[index];
                            return ConceptCard(
                              concept: concept,
                              isBookmarked: bookmarkedIds.contains(concept.id),
                              isLearned: learnedIds.contains(concept.id),
                              onTap: () => context.push(
                                AppRoutes.concept(concept.id),
                              ),
                              onBookmarkToggle: (_) => ref
                                  .read(userProfileNotifierProvider.notifier)
                                  .toggleBookmark(concept.id),
                              onLearnedToggle: (_) => ref
                                  .read(userProfileNotifierProvider.notifier)
                                  .toggleLearned(concept.id),
                            );
                          },
                        );
                      },
                      loading: () => const Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          children: [
                            ConceptCardSkeleton(),
                            SizedBox(height: 8),
                            ConceptCardSkeleton(),
                          ],
                        ),
                      ),
                      error: (e, _) => Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Text('Search error: $e'),
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
