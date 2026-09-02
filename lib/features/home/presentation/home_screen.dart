import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/data_providers.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../application/home_providers.dart';
import 'widgets/category_horizontal_list.dart';
import 'widgets/continue_learning_section.dart';
import 'widgets/daily_concept_banner.dart';
import 'widgets/streak_header.dart';
import 'widgets/trending_concepts_row.dart';

/// Home landing screen for the Concept learning application.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dailyPickAsync = ref.watch(dailyPickConceptProvider);
    final trendingAsync = ref.watch(trendingConceptsProvider);
    final inProgressAsync = ref.watch(inProgressCoursesProvider);
    final profileAsync = ref.watch(userProfileNotifierProvider);

    final userProfile = profileAsync.asData?.value;
    final bookmarkedIds = userProfile?.bookmarkedConceptIds.toSet() ?? const {};
    final learnedIds = userProfile?.learnedConceptIds.toSet() ?? const {};
    final streak = userProfile?.streakCount ?? 0;

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(dailyPickConceptProvider);
            ref.invalidate(trendingConceptsProvider);
            ref.invalidate(inProgressCoursesProvider);
            ref.read(userProfileNotifierProvider.notifier).loadProfile();
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                StreakHeader(streakCount: streak),
                dailyPickAsync.when(
                  data: (concept) => concept != null
                      ? DailyConceptBanner(
                          concept: concept,
                          isBookmarked: bookmarkedIds.contains(concept.id),
                          onBookmarkToggle: (_) => ref
                              .read(userProfileNotifierProvider.notifier)
                              .toggleBookmark(concept.id),
                        )
                      : const SizedBox.shrink(),
                  loading: () => const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: ConceptCardSkeleton(),
                  ),
                  error: (_, _) => const SizedBox.shrink(),
                ),
                const CategoryHorizontalList(),
                inProgressAsync.when(
                  data: (courses) => ContinueLearningSection(
                    inProgressCourses: courses,
                  ),
                  loading: () => const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: CourseCardSkeleton(),
                  ),
                  error: (_, _) => const SizedBox.shrink(),
                ),
                trendingAsync.when(
                  data: (concepts) => TrendingConceptsRow(
                    concepts: concepts,
                    bookmarkedIds: bookmarkedIds,
                    learnedIds: learnedIds,
                    onBookmarkToggle: (id) => ref
                        .read(userProfileNotifierProvider.notifier)
                        .toggleBookmark(id),
                    onLearnedToggle: (id) => ref
                        .read(userProfileNotifierProvider.notifier)
                        .toggleLearned(id),
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
                  error: (_, _) => const SizedBox.shrink(),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
