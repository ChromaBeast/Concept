import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/app_card.dart';

/// Warning box showing the common pitfall or anti-pattern for this concept.
class ConceptPitfallBox extends StatelessWidget {
  const ConceptPitfallBox({
    super.key,
    required this.commonPitfall,
  });

  final String commonPitfall;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: AppCard(
        accentColor: AppColors.warning,
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(
                  Icons.warning_amber_rounded,
                  size: 16,
                  color: AppColors.warning,
                ),
                const SizedBox(width: 8),
                const Text(
                  'COMMON PITFALL',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                    color: AppColors.warning,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              commonPitfall,
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
