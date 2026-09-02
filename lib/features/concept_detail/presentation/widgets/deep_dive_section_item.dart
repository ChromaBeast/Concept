import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/deep_dive.dart';

/// Reusable individual section item within the Deep Dive card.
class DeepDiveSectionItem extends StatelessWidget {
  const DeepDiveSectionItem({
    super.key,
    required this.section,
  });

  final DeepDiveSection section;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.catSystemDesign,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  section.heading,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.4,
                    color: isDark
                        ? AppColors.darkTextPrimary
                        : AppColors.lightTextPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            section.content,
            style: TextStyle(
              fontSize: 13.5,
              height: 1.5,
              color: isDark
                  ? AppColors.darkTextSecondary
                  : AppColors.lightTextSecondary,
            ),
          ),
          if (section.codeSnippet != null && section.codeSnippet!.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isDark
                      ? AppColors.darkBackground.withValues(alpha: 0.6)
                      : AppColors.lightBackground.withValues(alpha: 0.6),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                  ),
                ),
                child: Text(
                  section.codeSnippet!,
                  style: TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: isDark
                        ? AppColors.darkTextPrimary
                        : AppColors.lightTextPrimary,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
