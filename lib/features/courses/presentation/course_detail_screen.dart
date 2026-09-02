import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/router.dart';
import '../../../shared/widgets/empty_state_view.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../application/course_providers.dart';
import 'widgets/course_concept_item.dart';
import 'widgets/course_header.dart';

/// Screen detailing a course track curriculum and sequential lessons.
class CourseDetailScreen extends ConsumerWidget {
  const CourseDetailScreen({
    super.key,
    required this.courseId,
  });

  final String courseId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progressAsync = ref.watch(singleCourseProgressProvider(courseId));
    final conceptsAsync = ref.watch(courseConceptsProvider(courseId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Course Details'),
      ),
      body: progressAsync.when(
        data: (progressInfo) {
          if (progressInfo == null) {
            return const Center(
              child: EmptyStateView(
                icon: Icons.error_outline_rounded,
                title: 'Course not found',
                description: 'The requested course does not exist.',
              ),
            );
          }

          final completedSet = progressInfo.completedConceptIds.toSet();

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CourseHeader(progressInfo: progressInfo),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Curriculum',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        '${progressInfo.completedConcepts} of ${progressInfo.totalConcepts} completed',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                conceptsAsync.when(
                  data: (concepts) => ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: concepts.length,
                    itemBuilder: (context, index) {
                      final concept = concepts[index];
                      final isCompleted = completedSet.contains(concept.id);

                      return CourseConceptItem(
                        index: index + 1,
                        concept: concept,
                        isCompleted: isCompleted,
                        onTap: () => context.push(
                          AppRoutes.concept(concept.id, courseId: courseId),
                        ),
                      );
                    },
                  ),
                  loading: () => const Padding(
                    padding: EdgeInsets.all(16),
                    child: ConceptCardSkeleton(),
                  ),
                  error: (e, _) => Padding(
                    padding: const EdgeInsets.all(16),
                    child: Text('Error loading curriculum: $e'),
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          );
        },
        loading: () => const Center(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: CourseCardSkeleton(),
          ),
        ),
        error: (e, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text('Error: $e'),
          ),
        ),
      ),
    );
  }
}
