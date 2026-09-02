import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/quick_check.dart';
import '../../../../shared/widgets/quick_check_card.dart';

/// Section rendering interactive collapsible quick check questions and answers.
class ConceptQuickChecksSection extends StatelessWidget {
  const ConceptQuickChecksSection({
    super.key,
    required this.quickChecks,
  });

  final List<QuickCheck> quickChecks;

  @override
  Widget build(BuildContext context) {
    if (quickChecks.isEmpty) return const SizedBox.shrink();

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Row(
              children: [
                const Icon(
                  Icons.help_outline_rounded,
                  size: 16,
                  color: AppColors.catMlBasics,
                ),
                const SizedBox(width: 8),
                Text(
                  'KNOWLEDGE CHECKS (${quickChecks.length})',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                    color: isDark
                        ? AppColors.darkTextSecondary
                        : AppColors.lightTextSecondary,
                  ),
                ),
              ],
            ),
          ),
          ...quickChecks.map((qc) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: QuickCheckCard(
                quickCheck: qc,
              ),
            );
          }),
        ],
      ),
    );
  }
}
