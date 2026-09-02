import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../data/models/enums.dart';

/// Badge displaying difficulty level (Beginner, Intermediate, Advanced)
/// with level-appropriate color tinting.
class DifficultyBadge extends StatelessWidget {
  const DifficultyBadge({
    super.key,
    required this.difficulty,
    this.isCompact = false,
    this.showIndicator = true,
  });

  final Difficulty difficulty;
  final bool isCompact;
  final bool showIndicator;

  static Color getDifficultyColor(Difficulty diff) {
    switch (diff) {
      case Difficulty.beginner:
        return AppColors.success;
      case Difficulty.intermediate:
        return AppColors.warning;
      case Difficulty.advanced:
        return AppColors.catSecurity;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = getDifficultyColor(difficulty);

    return Container(
      padding: isCompact
          ? const EdgeInsets.symmetric(horizontal: 6, vertical: 2)
          : const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withValues(alpha: 0.35),
          width: 0.8,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showIndicator) ...[
            _DifficultyDotIndicator(
              difficulty: difficulty,
              color: color,
            ),
            const SizedBox(width: 4),
          ],
          Text(
            difficulty.label,
            style: TextStyle(
              fontSize: isCompact ? 10.5 : 11.5,
              fontWeight: FontWeight.w600,
              color: color,
              letterSpacing: 0.1,
            ),
          ),
        ],
      ),
    );
  }
}

class _DifficultyDotIndicator extends StatelessWidget {
  const _DifficultyDotIndicator({
    required this.difficulty,
    required this.color,
  });

  final Difficulty difficulty;
  final Color color;

  int get _level {
    switch (difficulty) {
      case Difficulty.beginner:
        return 1;
      case Difficulty.intermediate:
        return 2;
      case Difficulty.advanced:
        return 3;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(3, (index) {
        final isFilled = index < _level;
        return Container(
          margin: EdgeInsets.only(right: index < 2 ? 1.5 : 0),
          width: 3.5,
          height: 3.5 + (index * 1.5),
          decoration: BoxDecoration(
            color: isFilled ? color : color.withValues(alpha: 0.25),
            borderRadius: BorderRadius.circular(1),
          ),
        );
      }),
    );
  }
}
