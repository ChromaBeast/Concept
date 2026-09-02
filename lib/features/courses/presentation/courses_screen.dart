import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../data/models/enums.dart';
import '../../../shared/widgets/course_card.dart';
import '../../../shared/widgets/empty_state_view.dart';
import '../../../shared/widgets/shimmer_loading.dart';
import '../application/course_providers.dart';

/// Screen listing all structured courses and learning paths.
class CoursesScreen extends ConsumerWidget {
  const CoursesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedCategory = ref.watch(courseCategoryFilterProvider);
    final coursesAsync = ref.watch(allCoursesProgressProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Courses & Tracks'),
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
          ref.invalidate(allCoursesProgressProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Row(
                  children: [
                    _FilterPill(
                      label: 'All Tracks',
                      isSelected: selectedCategory == null,
                      onTap: () => ref
                          .read(courseCategoryFilterProvider.notifier)
                          .state = null,
                    ),
                    const SizedBox(width: 8),
                    ...Category.values.map((cat) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: _FilterPill(
                          label: cat.label,
                          isSelected: selectedCategory == cat,
                          onTap: () => ref
                              .read(courseCategoryFilterProvider.notifier)
                              .state = selectedCategory == cat ? null : cat,
                        ),
                      );
                    }),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              coursesAsync.when(
                data: (courses) {
                  final filtered = selectedCategory == null
                      ? courses
                      : courses
                          .where(
                            (c) => c.course.primaryCategory == selectedCategory,
                          )
                          .toList();

                  if (filtered.isEmpty) {
                    return Padding(
                      padding: const EdgeInsets.all(24),
                      child: EmptyStateView(
                        icon: Icons.school_outlined,
                        title: 'No courses found',
                        description:
                            'No courses match the selected category filter.',
                        actionLabel: 'Show All',
                        onAction: () => ref
                            .read(courseCategoryFilterProvider.notifier)
                            .state = null,
                      ),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final item = filtered[index];
                      return CourseCard(
                        course: item.course,
                        progress: item.completionPercentage,
                        onTap: () =>
                            context.push(AppRoutes.course(item.course.id)),
                      );
                    },
                  );
                },
                loading: () => const Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    children: [
                      CourseCardSkeleton(),
                      SizedBox(height: 12),
                      CourseCardSkeleton(),
                    ],
                  ),
                ),
                error: (e, _) => Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Text(
                      'Error loading courses: $e',
                      style: TextStyle(
                        color: isDark
                            ? AppColors.darkTextSecondary
                            : AppColors.lightTextSecondary,
                      ),
                    ),
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

class _FilterPill extends StatelessWidget {
  const _FilterPill({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary
              : (isDark
                  ? AppColors.darkSurfaceVariant
                  : AppColors.lightSurfaceVariant),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? AppColors.primary
                : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
            color: isSelected
                ? Colors.white
                : (isDark
                    ? AppColors.darkTextSecondary
                    : AppColors.lightTextSecondary),
          ),
        ),
      ),
    );
  }
}
