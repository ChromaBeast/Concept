import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/app_card.dart';

/// Box highlighting why this concept is important in engineering practice.
class ConceptWhyMattersBox extends StatelessWidget {
  const ConceptWhyMattersBox({
    super.key,
    required this.whyItMatters,
  });

  final String whyItMatters;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: AppCard(
        accentColor: AppColors.catOperatingSystems,
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(
                  Icons.psychology_alt_rounded,
                  size: 16,
                  color: AppColors.catOperatingSystems,
                ),
                const SizedBox(width: 8),
                const Text(
                  'WHY IT MATTERS',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                    color: AppColors.catOperatingSystems,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              whyItMatters,
              style: TextStyle(
                fontSize: 14.5,
                height: 1.5,
                color: isDark
                    ? AppColors.darkTextPrimary
                    : AppColors.lightTextPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
