import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/router.dart';
import '../../../data/data_providers.dart';
import '../../../shared/widgets/concept_card.dart';
import '../../../shared/widgets/empty_state_view.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../application/bookmarks_providers.dart';
import 'widgets/bookmarks_filter_row.dart';

/// Screen displaying all user bookmarked concepts with category filtering.
class BookmarksScreen extends ConsumerWidget {
  const BookmarksScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookmarksAsync = ref.watch(bookmarkedConceptsProvider);
    final selectedCategory = ref.watch(bookmarksCategoryFilterProvider);
    final profileAsync = ref.watch(userProfileNotifierProvider);

    final userProfile = profileAsync.asData?.value;
    final learnedIds = userProfile?.learnedConceptIds.toSet() ?? const {};

    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Concepts'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search_rounded),
            tooltip: 'Search',
            onPressed: () => context.push(AppRoutes.search),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(bookmarkedConceptsProvider);
        },
        child: bookmarksAsync.when(
          data: (bookmarks) {
            if (bookmarks.isEmpty) {
              return Center(
                child: EmptyStateView(
                  icon: Icons.bookmark_border_rounded,
                  title: 'No bookmarks yet',
                  description:
                      'Tap the bookmark icon on any concept card or detail page to save it for quick revision.',
                  actionLabel: 'Browse Concepts',
                  onAction: () => context.go(AppRoutes.browse),
                ),
              );
            }

            final presentCategories =
                bookmarks.map((b) => b.category).toSet().toList();

            final filtered = selectedCategory == null
                ? bookmarks
                : bookmarks
                    .where((b) => b.category == selectedCategory)
                    .toList();

            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  BookmarksFilterRow(
                    categories: presentCategories,
                    selectedCategory: selectedCategory,
                    onCategorySelected: (cat) => ref
                        .read(bookmarksCategoryFilterProvider.notifier)
                        .state = cat,
                  ),
                  if (filtered.isEmpty)
                    Padding(
                      padding: const EdgeInsets.all(24),
                      child: EmptyStateView(
                        icon: Icons.filter_list_off_rounded,
                        title: 'No concepts in this category',
                        description:
                            'You do not have any bookmarked concepts for ${selectedCategory?.label}.',
                        actionLabel: 'Clear Category Filter',
                        onAction: () => ref
                            .read(bookmarksCategoryFilterProvider.notifier)
                            .state = null,
                      ),
                    )
                  else
                    ListView.builder(
                      padding: const EdgeInsets.all(16),
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: filtered.length,
                      itemBuilder: (context, index) {
                        final concept = filtered[index];
                        return ConceptCard(
                          concept: concept,
                          isBookmarked: true,
                          isLearned: learnedIds.contains(concept.id),
                          onTap: () =>
                              context.push(AppRoutes.concept(concept.id)),
                          onBookmarkToggle: (_) => ref
                              .read(userProfileNotifierProvider.notifier)
                              .toggleBookmark(concept.id),
                          onLearnedToggle: (_) => ref
                              .read(userProfileNotifierProvider.notifier)
                              .toggleLearned(concept.id),
                        );
                      },
                    ),
                  const SizedBox(height: 24),
                ],
              ),
            );
          },
          loading: () => const Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                ConceptCardSkeleton(),
                SizedBox(height: 12),
                ConceptCardSkeleton(),
              ],
            ),
          ),
          error: (e, _) => Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Text('Error loading bookmarks: $e'),
            ),
          ),
        ),
      ),
    );
  }
}
