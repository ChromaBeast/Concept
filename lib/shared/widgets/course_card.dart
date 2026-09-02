import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/category_utils.dart';
import '../../core/utils/read_time_formatter.dart';
import '../../data/models/course.dart';
import 'app_card.dart';
import 'category_chip.dart';
import 'difficulty_badge.dart';
import 'progress_bar.dart';

/// Course card showing title, category, difficulty, concept count,
/// total duration, and completion progress bar.
class CourseCard extends StatelessWidget {
  const CourseCard({
    super.key,
    required this.course,
    this.onTap,
    this.progress = 0.0,
    this.showProgress = true,
    this.margin = const EdgeInsets.only(bottom: 14.0),
  });

  final Course course;
  final VoidCallback? onTap;
  final double progress;
  final bool showProgress;
  final EdgeInsetsGeometry margin;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final accentColor = CategoryUtils.getAccentColor(course.primaryCategory);
    final durationText =
        ReadTimeFormatter.formatCourseDuration(course.totalReadSeconds);

    return AppCard(
      onTap: onTap,
      accentColor: accentColor,
      margin: margin,
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CategoryChip(
                category: course.primaryCategory,
                compact: true,
              ),
              DifficultyBadge(
                difficulty: course.difficulty,
                isCompact: true,
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            course.title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 16.5,
              fontWeight: FontWeight.w700,
              height: 1.3,
              color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            course.description,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 13,
              height: 1.45,
              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              _CourseInfoItem(
                icon: Icons.layers_outlined,
                text: '${course.conceptIds.length} concepts',
                isDark: isDark,
              ),
              const SizedBox(width: 14),
              _CourseInfoItem(
                icon: Icons.schedule_rounded,
                text: durationText,
                isDark: isDark,
              ),
            ],
          ),
          if (showProgress && progress > 0) ...[
            const SizedBox(height: 14),
            ProgressBar(
              progress: progress,
              color: accentColor,
              height: 5.0,
              showLabel: true,
            ),
          ],
        ],
      ),
    );
  }
}

class _CourseInfoItem extends StatelessWidget {
  const _CourseInfoItem({
    required this.icon,
    required this.text,
    required this.isDark,
  });

  final IconData icon;
  final String text;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          icon,
          size: 13.5,
          color: isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary,
        ),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.w500,
            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
          ),
        ),
      ],
    );
  }
}
