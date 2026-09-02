import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:share_plus/share_plus.dart';
import '../../../core/theme/app_colors.dart';
import '../../../data/data_providers.dart';
import '../../../shared/widgets/empty_state_view.dart';
import '../../../shared/widgets/feedback_snackbar.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../application/concept_detail_providers.dart';
import 'widgets/concept_definition_box.dart';
import 'widgets/concept_example_box.dart';
import 'widgets/concept_header_section.dart';
import 'widgets/concept_hero_image.dart';
import 'widgets/concept_interview_box.dart';
import 'widgets/concept_pitfall_box.dart';
import 'widgets/concept_quick_checks_section.dart';
import 'widgets/concept_related_row.dart';
import 'widgets/concept_why_matters_box.dart';
import 'widgets/next_in_course_bar.dart';

/// Full screen view for mastering an individual engineering concept.
class ConceptDetailScreen extends ConsumerWidget {
  const ConceptDetailScreen({
    super.key,
    required this.conceptId,
    this.courseId,
  });

  final String conceptId;
  final String? courseId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conceptAsync = ref.watch(singleConceptProvider(conceptId));
    final relatedAsync = ref.watch(relatedConceptsProvider(conceptId));
    final navAsync = ref.watch(
      courseNavProvider((conceptId: conceptId, courseId: courseId)),
    );
    final profileAsync = ref.watch(userProfileNotifierProvider);

    final userProfile = profileAsync.asData?.value;
    final isBookmarked =
        userProfile?.bookmarkedConceptIds.contains(conceptId) ?? false;
    final isLearned =
        userProfile?.learnedConceptIds.contains(conceptId) ?? false;

    return conceptAsync.when(
      data: (concept) {
        if (concept == null) {
          return Scaffold(
            appBar: AppBar(title: const Text('Concept')),
            body: const Center(
              child: EmptyStateView(
                icon: Icons.error_outline_rounded,
                title: 'Concept not found',
                description: 'The requested concept could not be found.',
              ),
            ),
          );
        }

        final navInfo = navAsync.asData?.value ?? const CourseNavInfo();

        return Scaffold(
          appBar: AppBar(
            title: Text(
              courseId != null && navInfo.course != null
                  ? navInfo.course!.title
                  : concept.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 16),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.share_outlined, size: 20),
                tooltip: 'Share',
                onPressed: () => Share.share(
                  '${concept.title}: ${concept.oneLiner} - Learn on Concept app!',
                ),
              ),
              IconButton(
                icon: Icon(
                  isBookmarked
                      ? Icons.bookmark_rounded
                      : Icons.bookmark_outline_rounded,
                  color: isBookmarked ? AppColors.primaryLight : null,
                  size: 22,
                ),
                tooltip: isBookmarked ? 'Bookmarked' : 'Bookmark',
                onPressed: () {
                  HapticFeedback.lightImpact();
                  ref
                      .read(userProfileNotifierProvider.notifier)
                      .toggleBookmark(concept.id);
                  if (isBookmarked) {
                    FeedbackSnackbar.showUndo(
                      context: context,
                      message: 'Bookmark removed',
                      onUndo: () => ref
                          .read(userProfileNotifierProvider.notifier)
                          .toggleBookmark(concept.id),
                    );
                  }
                },
              ),
            ],
          ),
          bottomNavigationBar: NextInCourseBar(
            isLearned: isLearned,
            onLearnedToggle: () {
              HapticFeedback.mediumImpact();
              ref
                  .read(userProfileNotifierProvider.notifier)
                  .toggleLearned(concept.id);
              if (isLearned) {
                FeedbackSnackbar.showUndo(
                  context: context,
                  message: 'Marked as unlearned',
                  onUndo: () => ref
                      .read(userProfileNotifierProvider.notifier)
                      .toggleLearned(concept.id),
                );
              }
            },
            navInfo: navInfo,
            courseId: courseId,
          ),
          body: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ConceptHeaderSection(concept: concept),
                ConceptDefinitionBox(definition: concept.body.definition),
                ConceptWhyMattersBox(whyItMatters: concept.body.whyItMatters),
                ConceptHeroImage(concept: concept),
                ConceptExampleBox(example: concept.body.example),
                if (concept.body.commonPitfall != null &&
                    concept.body.commonPitfall!.isNotEmpty)
                  ConceptPitfallBox(
                    commonPitfall: concept.body.commonPitfall!,
                  ),
                if (concept.body.interviewAngle != null &&
                    concept.body.interviewAngle!.isNotEmpty)
                  ConceptInterviewBox(
                    interviewAngle: concept.body.interviewAngle!,
                  ),
                if (concept.body.quickChecks.isNotEmpty)
                  ConceptQuickChecksSection(
                    quickChecks: concept.body.quickChecks,
                  ),
                relatedAsync.when(
                  data: (related) => ConceptRelatedRow(relatedConcepts: related),
                  loading: () => const SizedBox.shrink(),
                  error: (_, _) => const SizedBox.shrink(),
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        );
      },
      loading: () => Scaffold(
        appBar: AppBar(title: const Text('Loading...')),
        body: const Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            children: [
              ConceptCardSkeleton(),
              SizedBox(height: 12),
              ConceptCardSkeleton(),
            ],
          ),
        ),
      ),
      error: (e, _) => Scaffold(
        appBar: AppBar(title: const Text('Error')),
        body: Center(child: Text('Error loading concept: $e')),
      ),
    );
  }
}
