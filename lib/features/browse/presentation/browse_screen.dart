import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/category_domains.dart';
import '../../../data/data_providers.dart';
import '../../../shared/widgets/feedback_snackbar.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../application/browse_providers.dart';
import 'widgets/browse_filter_bar.dart';
import 'widgets/category_grid.dart';
import 'widgets/concepts_list_view.dart';
import 'widgets/domain_cluster_filter.dart';
import 'widgets/selected_category_header.dart';

/// Browse catalog screen allowing users to filter by domain, category, difficulty, and tag.
class BrowseScreen extends ConsumerWidget {
  const BrowseScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedDomain = ref.watch(selectedDomainProvider);
    final selectedCategory = ref.watch(selectedCategoryProvider);
    final selectedDifficulty = ref.watch(selectedDifficultyProvider);
    final conceptsAsync = ref.watch(filteredConceptsProvider);
    final countsAsync = ref.watch(categoryConceptCountsProvider);
    final profileAsync = ref.watch(userProfileNotifierProvider);

    final userProfile = profileAsync.asData?.value;
    final bookmarkedIds = userProfile?.bookmarkedConceptIds.toSet() ?? const {};
    final learnedIds = userProfile?.learnedConceptIds.toSet() ?? const {};
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Browse Concepts'),
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
          ref.invalidate(filteredConceptsProvider);
          ref.invalidate(categoryConceptCountsProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              BrowseFilterBar(
                selectedDifficulty: selectedDifficulty,
                onDifficultySelected: (diff) =>
                    ref.read(selectedDifficultyProvider.notifier).state = diff,
                selectedCategory: selectedCategory,
                onClearCategory: () =>
                    ref.read(selectedCategoryProvider.notifier).state = null,
                onClearAll: () {
                  ref.read(selectedDomainProvider.notifier).state = CategoryDomain.all;
                  ref.read(selectedCategoryProvider.notifier).state = null;
                  ref.read(selectedDifficultyProvider.notifier).state = null;
                  ref.read(selectedTagIdProvider.notifier).state = null;
                },
              ),
              DomainClusterFilter(
                selectedDomain: selectedDomain,
                onDomainSelected: (domain) {
                  ref.read(selectedDomainProvider.notifier).state = domain;
                  if (selectedCategory != null && !domain.contains(selectedCategory)) {
                    ref.read(selectedCategoryProvider.notifier).state = null;
                  }
                },
              ),
              const SizedBox(height: 6),
              if (selectedCategory == null) ...[
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                  child: Text(
                    selectedDomain == CategoryDomain.all
                        ? 'All Categories'
                        : '${selectedDomain.label} Categories',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: isDark
                          ? AppColors.darkTextPrimary
                          : AppColors.lightTextPrimary,
                    ),
                  ),
                ),
                countsAsync.when(
                  data: (counts) => CategoryGrid(
                    selectedCategory: selectedCategory,
                    categoryCounts: counts,
                    categories: selectedDomain == CategoryDomain.all
                        ? null
                        : selectedDomain.categories,
                    onCategorySelected: (cat) =>
                        ref.read(selectedCategoryProvider.notifier).state = cat,
                  ),
                  loading: () => const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: ConceptCardSkeleton(),
                  ),
                  error: (_, _) => const SizedBox.shrink(),
                ),
              ] else ...[
                SelectedCategoryHeader(
                  category: selectedCategory,
                  onDeselect: () =>
                      ref.read(selectedCategoryProvider.notifier).state = null,
                ),
              ],
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                child: Text(
                  selectedCategory != null
                      ? '${selectedCategory.label} Concepts'
                      : selectedDomain != CategoryDomain.all
                          ? '${selectedDomain.label} Concepts'
                          : 'All Concepts',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: isDark
                        ? AppColors.darkTextPrimary
                        : AppColors.lightTextPrimary,
                  ),
                ),
              ),
              conceptsAsync.when(
                data: (concepts) => ConceptsListView(
                  concepts: concepts,
                  bookmarkedIds: bookmarkedIds,
                  learnedIds: learnedIds,
                  onBookmarkToggle: (id) {
                    final wasBookmarked = bookmarkedIds.contains(id);
                    ref.read(userProfileNotifierProvider.notifier).toggleBookmark(id);
                    if (wasBookmarked) {
                      FeedbackSnackbar.showUndo(
                        context: context,
                        message: 'Bookmark removed',
                        onUndo: () => ref
                            .read(userProfileNotifierProvider.notifier)
                            .toggleBookmark(id),
                      );
                    }
                  },
                  onLearnedToggle: (id) {
                    final wasLearned = learnedIds.contains(id);
                    ref.read(userProfileNotifierProvider.notifier).toggleLearned(id);
                    if (wasLearned) {
                      FeedbackSnackbar.showUndo(
                        context: context,
                        message: 'Marked as unlearned',
                        onUndo: () => ref
                            .read(userProfileNotifierProvider.notifier)
                            .toggleLearned(id),
                      );
                    }
                  },
                  onResetFilters: () {
                    ref.read(selectedDomainProvider.notifier).state = CategoryDomain.all;
                    ref.read(selectedCategoryProvider.notifier).state = null;
                    ref.read(selectedDifficultyProvider.notifier).state = null;
                    ref.read(selectedTagIdProvider.notifier).state = null;
                  },
                ),
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
                    child: Text('Error loading concepts: $e'),
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
