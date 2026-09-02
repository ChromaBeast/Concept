import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/tag.dart';
import '../../../../shared/widgets/tag_chip.dart';

/// Grid/Wrap displaying popular and trending tags for discovery.
class TrendingTagsGrid extends StatelessWidget {
  const TrendingTagsGrid({
    super.key,
    required this.tags,
    required this.onTagSelected,
  });

  final List<Tag> tags;
  final ValueChanged<String> onTagSelected;

  @override
  Widget build(BuildContext context) {
    if (tags.isEmpty) return const SizedBox.shrink();

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.trending_up_rounded,
                size: 16,
                color: AppColors.primaryLight,
              ),
              const SizedBox(width: 8),
              Text(
                'Popular Tags',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: isDark
                      ? AppColors.darkTextPrimary
                      : AppColors.lightTextPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: tags.map((tag) {
              return TagChip(
                tag: tag.name,
                onTap: () => onTagSelected(tag.name),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
