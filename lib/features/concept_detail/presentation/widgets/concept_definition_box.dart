import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/app_card.dart';

/// Box highlighting the core 40-word concept definition.
class ConceptDefinitionBox extends StatelessWidget {
  const ConceptDefinitionBox({
    super.key,
    required this.definition,
    this.accentColor = AppColors.primaryLight,
  });

  final String definition;
  final Color accentColor;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: AppCard(
        accentColor: accentColor,
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.menu_book_rounded,
                  size: 16,
                  color: accentColor,
                ),
                const SizedBox(width: 8),
                Text(
                  'DEFINITION',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                    color: accentColor,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              definition,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
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
