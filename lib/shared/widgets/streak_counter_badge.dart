import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

/// Badge displaying a flame icon and current learning streak count.
class StreakCounterBadge extends StatelessWidget {
  const StreakCounterBadge({
    super.key,
    required this.streakCount,
    this.isActive = true,
    this.onTap,
    this.compact = false,
  });

  final int streakCount;
  final bool isActive;
  final VoidCallback? onTap;
  final bool compact;

  static const Color flameColor = Color(0xFFFF6B2B);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final active = isActive && streakCount > 0;
    final color = active
        ? flameColor
        : (isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary);

    final bgColor = active
        ? flameColor.withValues(alpha: isDark ? 0.16 : 0.12)
        : (isDark ? AppColors.darkSurfaceVariant : AppColors.lightSurfaceVariant);

    final borderColor = active
        ? flameColor.withValues(alpha: 0.35)
        : (isDark ? AppColors.darkBorder : AppColors.lightBorder);

    final padding = compact
        ? const EdgeInsets.symmetric(horizontal: 6, vertical: 3)
        : const EdgeInsets.symmetric(horizontal: 9, vertical: 4);

    final fontSize = compact ? 11.5 : 13.0;
    final iconSize = compact ? 13.0 : 16.0;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: borderColor,
              width: 0.8,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.local_fire_department_rounded,
                size: iconSize,
                color: color,
              ),
              const SizedBox(width: 3),
              Text(
                '$streakCount',
                style: TextStyle(
                  fontSize: fontSize,
                  fontWeight: FontWeight.w700,
                  color: color,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
