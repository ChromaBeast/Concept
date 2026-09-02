import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

/// Clean tag chip widget with '#' prefix and interactive tap handler.
class TagChip extends StatelessWidget {
  const TagChip({
    super.key,
    required this.tag,
    this.onTap,
    this.isSelected = false,
    this.onDeleted,
    this.accentColor,
    this.compact = false,
  });

  final String tag;
  final VoidCallback? onTap;
  final bool isSelected;
  final VoidCallback? onDeleted;
  final Color? accentColor;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cleanTag = tag.startsWith('#') ? tag.substring(1) : tag;
    final primaryAccent = accentColor ?? AppColors.primary;

    final bgColor = isSelected
        ? primaryAccent.withValues(alpha: isDark ? 0.20 : 0.12)
        : (isDark ? AppColors.darkSurfaceVariant : AppColors.lightSurfaceVariant);

    final borderColor = isSelected
        ? primaryAccent.withValues(alpha: 0.5)
        : (isDark ? AppColors.darkBorder : AppColors.lightBorder);

    final textColor = isSelected
        ? primaryAccent
        : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary);

    final prefixColor = isSelected
        ? primaryAccent.withValues(alpha: 0.7)
        : (isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary);

    final padding = compact
        ? const EdgeInsets.symmetric(horizontal: 7, vertical: 3)
        : const EdgeInsets.symmetric(horizontal: 9, vertical: 5);

    final fontSize = compact ? 11.0 : 12.0;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
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
              Text(
                '#',
                style: TextStyle(
                  fontSize: fontSize,
                  fontWeight: FontWeight.w600,
                  color: prefixColor,
                ),
              ),
              const SizedBox(width: 2),
              Text(
                cleanTag,
                style: TextStyle(
                  fontSize: fontSize,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  color: textColor,
                ),
              ),
              if (onDeleted != null) ...[
                const SizedBox(width: 4),
                GestureDetector(
                  onTap: onDeleted,
                  child: Icon(
                    Icons.close_rounded,
                    size: fontSize + 2,
                    color: textColor,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
