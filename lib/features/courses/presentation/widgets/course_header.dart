import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/category_utils.dart';
import '../../../../core/utils/read_time_formatter.dart';
import '../../../../data/models/course_progress_info.dart';
import '../../../../shared/widgets/category_chip.dart';
import '../../../../shared/widgets/difficulty_badge.dart';
import '../../../../shared/widgets/progress_bar.dart';

/// Header section in course detail displaying course metadata, progress, and CTA button.
class CourseHeader extends StatelessWidget {
  const CourseHeader({
    super.key,
    required this.progressInfo,
  });

  final CourseProgressInfo progressInfo;

  @override
  Widget build(BuildContext context) {
    final course = progressInfo.course;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final accent = CategoryUtils.getAccentColor(course.primaryCategory);
    final durationText =
        ReadTimeFormatter.formatCourseDuration(course.totalReadSeconds);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: accent.withValues(alpha: isDark ? 0.12 : 0.06),
        border: Border(
          bottom: BorderSide(
            color: accent.withValues(alpha: isDark ? 0.3 : 0.2),
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CategoryChip(category: course.primaryCategory, compact: true),
              DifficultyBadge(difficulty: course.difficulty, isCompact: true),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            course.title,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              height: 1.25,
              color: isDark
                  ? AppColors.darkTextPrimary
                  : AppColors.lightTextPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            course.description,
            style: TextStyle(
              fontSize: 14,
              height: 1.45,
              color: isDark
                  ? AppColors.darkTextSecondary
                  : AppColors.lightTextSecondary,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _InfoPill(
                icon: Icons.layers_outlined,
                label: '${course.conceptIds.length} concepts',
              ),
              const SizedBox(width: 12),
              _InfoPill(
                icon: Icons.schedule_rounded,
                label: durationText,
              ),
              const SizedBox(width: 12),
              _InfoPill(
                icon: Icons.check_circle_outline_rounded,
                label:
                    '${progressInfo.completedConcepts}/${progressInfo.totalConcepts}',
              ),
            ],
          ),
          const SizedBox(height: 16),
          ProgressBar(
            progress: progressInfo.completionPercentage,
            color: accent,
            height: 6.0,
            showLabel: true,
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                final targetId =
                    progressInfo.nextConceptId ?? course.conceptIds.firstOrNull;
                if (targetId != null) {
                  context.push(AppRoutes.concept(targetId, courseId: course.id));
                }
              },
              icon: Icon(
                progressInfo.isCompleted
                    ? Icons.replay_rounded
                    : (progressInfo.isStarted
                        ? Icons.play_arrow_rounded
                        : Icons.start_rounded),
              ),
              label: Text(
                progressInfo.isCompleted
                    ? 'Review Course'
                    : (progressInfo.isStarted
                        ? 'Continue Learning'
                        : 'Start Course'),
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: accent,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoPill extends StatelessWidget {
  const _InfoPill({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          size: 14,
          color: isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary,
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
          ),
        ),
      ],
    );
  }
}
