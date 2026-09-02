import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/category_utils.dart';
import '../../data/models/concept.dart';
import 'app_card.dart';
import 'category_chip.dart';
import 'difficulty_badge.dart';
import 'read_time_badge.dart';

/// Reusable concept item card showing category indicator, title, one-liner,
/// read time, difficulty, bookmark toggle, and learned status checkmark.
class ConceptCard extends StatelessWidget {
  const ConceptCard({
    super.key,
    required this.concept,
    this.onTap,
    this.isBookmarked = false,
    this.onBookmarkToggle,
    this.isLearned = false,
    this.onLearnedToggle,
    this.showBookmark = true,
    this.showLearnedStatus = true,
    this.margin = const EdgeInsets.only(bottom: 12.0),
  });

  final Concept concept;
  final VoidCallback? onTap;
  final bool isBookmarked;
  final ValueChanged<bool>? onBookmarkToggle;
  final bool isLearned;
  final ValueChanged<bool>? onLearnedToggle;
  final bool showBookmark;
  final bool showLearnedStatus;
  final EdgeInsetsGeometry margin;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final accentColor = CategoryUtils.getAccentColor(concept.category);

    return AppCard(
      onTap: onTap,
      accentColor: accentColor,
      margin: margin,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CategoryChip(
                category: concept.category,
                compact: true,
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  DifficultyBadge(
                    difficulty: concept.difficulty,
                    isCompact: true,
                  ),
                  if (showLearnedStatus) ...[
                    const SizedBox(width: 4),
                    _LearnedButton(
                      isLearned: isLearned,
                      onToggle: onLearnedToggle != null
                          ? () => onLearnedToggle!(!isLearned)
                          : null,
                    ),
                  ],
                  if (showBookmark) ...[
                    const SizedBox(width: 2),
                    _BookmarkButton(
                      isBookmarked: isBookmarked,
                      onToggle: onBookmarkToggle != null
                          ? () => onBookmarkToggle!(!isBookmarked)
                          : null,
                    ),
                  ],
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            concept.title,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 15.5,
              fontWeight: FontWeight.w600,
              height: 1.3,
              color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            concept.oneLiner,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 13,
              height: 1.45,
              color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              ReadTimeBadge(
                seconds: concept.estimatedReadSeconds,
              ),
              if (concept.askedByCompanies.isNotEmpty) ...[
                const SizedBox(width: 12),
                Icon(
                  Icons.business_rounded,
                  size: 13,
                  color: isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary,
                ),
                const SizedBox(width: 4),
                Text(
                  '${concept.askedByCompanies.length} co.',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: isDark
                        ? AppColors.darkTextTertiary
                        : AppColors.lightTextTertiary,
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _LearnedButton extends StatelessWidget {
  const _LearnedButton({required this.isLearned, this.onToggle});
  final bool isLearned;
  final VoidCallback? onToggle;

  @override
  Widget build(BuildContext context) {
    return IconButton(
      visualDensity: VisualDensity.compact,
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
      onPressed: onToggle == null
          ? null
          : () {
              HapticFeedback.lightImpact();
              onToggle!();
            },
      tooltip: isLearned ? 'Learned' : 'Mark as learned',
      icon: Icon(
        isLearned ? Icons.check_circle_rounded : Icons.check_circle_outline_rounded,
        size: 18,
        color: isLearned ? AppColors.success : AppColors.darkTextTertiary,
      ),
    );
  }
}

class _BookmarkButton extends StatelessWidget {
  const _BookmarkButton({required this.isBookmarked, this.onToggle});
  final bool isBookmarked;
  final VoidCallback? onToggle;

  @override
  Widget build(BuildContext context) {
    return IconButton(
      visualDensity: VisualDensity.compact,
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
      onPressed: onToggle == null
          ? null
          : () {
              HapticFeedback.lightImpact();
              onToggle!();
            },
      tooltip: isBookmarked ? 'Remove bookmark' : 'Bookmark',
      icon: Icon(
        isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_outline_rounded,
        size: 18,
        color: isBookmarked ? AppColors.primaryLight : AppColors.darkTextTertiary,
      ),
    );
  }
}
