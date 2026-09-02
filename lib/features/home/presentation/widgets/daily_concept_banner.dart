import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/category_utils.dart';
import '../../../../data/models/models.dart';
import '../../../../shared/widgets/category_chip.dart';
import '../../../../shared/widgets/difficulty_badge.dart';
import '../../../../shared/widgets/read_time_badge.dart';

/// Prominent hero banner showcasing the featured concept of the day.
class DailyConceptBanner extends StatelessWidget {
  const DailyConceptBanner({
    super.key,
    required this.concept,
    this.isBookmarked = false,
    this.onBookmarkToggle,
  });

  final Concept concept;
  final bool isBookmarked;
  final ValueChanged<bool>? onBookmarkToggle;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final accent = CategoryUtils.getAccentColor(concept.category);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            accent.withValues(alpha: isDark ? 0.22 : 0.12),
            accent.withValues(alpha: isDark ? 0.06 : 0.03),
          ],
        ),
        border: Border.all(
          color: accent.withValues(alpha: isDark ? 0.45 : 0.3),
          width: 1.2,
        ),
      ),
      child: InkWell(
        onTap: () => context.push(AppRoutes.concept(concept.id)),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: accent.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.auto_awesome_rounded,
                              size: 13,
                              color: accent,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              "DAILY CONCEPT",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: accent,
                                letterSpacing: 0.6,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      CategoryChip(category: concept.category, compact: true),
                    ],
                  ),
                  IconButton(
                    visualDensity: VisualDensity.compact,
                    onPressed: onBookmarkToggle != null
                        ? () => onBookmarkToggle!(!isBookmarked)
                        : null,
                    icon: Icon(
                      isBookmarked
                          ? Icons.bookmark_rounded
                          : Icons.bookmark_outline_rounded,
                      color: isBookmarked
                          ? AppColors.primaryLight
                          : (isDark
                              ? AppColors.darkTextSecondary
                              : AppColors.lightTextSecondary),
                      size: 20,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                concept.title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  height: 1.3,
                  color: isDark
                      ? AppColors.darkTextPrimary
                      : AppColors.lightTextPrimary,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                concept.oneLiner,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 13.5,
                  height: 1.45,
                  color: isDark
                      ? AppColors.darkTextSecondary
                      : AppColors.lightTextSecondary,
                ),
              ),
              const SizedBox(height: 14),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      DifficultyBadge(
                        difficulty: concept.difficulty,
                        isCompact: true,
                      ),
                      const SizedBox(width: 8),
                      ReadTimeBadge(seconds: concept.estimatedReadSeconds),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: accent,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Read Now',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(width: 4),
                        Icon(
                          Icons.arrow_forward_rounded,
                          size: 13,
                          color: Colors.white,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
