import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/category_utils.dart';
import '../../data/models/enums.dart';

/// Interactive or display category chip with category icon and accent color.
class CategoryChip extends StatelessWidget {
  const CategoryChip({
    super.key,
    required this.category,
    this.isSelected = false,
    this.showIcon = true,
    this.count,
    this.onTap,
    this.compact = false,
  });

  final Category category;
  final bool isSelected;
  final bool showIcon;
  final int? count;
  final VoidCallback? onTap;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final accentColor = CategoryUtils.getAccentColor(category);
    final icon = CategoryUtils.getIcon(category);
    final label = CategoryUtils.getDisplayName(category);

    final bgColor = isSelected
        ? accentColor.withValues(alpha: isDark ? 0.20 : 0.14)
        : (isDark ? AppColors.darkSurfaceVariant : AppColors.lightSurfaceVariant);

    final borderColor = isSelected
        ? accentColor.withValues(alpha: 0.6)
        : (isDark ? AppColors.darkBorder : AppColors.lightBorder);

    final textColor = isSelected
        ? accentColor
        : (isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary);

    final padding = compact
        ? const EdgeInsets.symmetric(horizontal: 8, vertical: 4)
        : const EdgeInsets.symmetric(horizontal: 10, vertical: 6);

    final iconSize = compact ? 13.0 : 15.0;
    final fontSize = compact ? 11.0 : 12.0;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeInOut,
          padding: padding,
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: borderColor,
              width: isSelected ? 1.2 : 0.8,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (showIcon) ...[
                Icon(
                  icon,
                  size: iconSize,
                  color: isSelected ? accentColor : textColor,
                ),
                const SizedBox(width: 5),
              ],
              Text(
                label,
                style: TextStyle(
                  fontSize: fontSize,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  color: textColor,
                ),
              ),
              if (count != null) ...[
                const SizedBox(width: 6),
                _CountBadge(
                  count: count!,
                  accentColor: accentColor,
                  isSelected: isSelected,
                  isDark: isDark,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _CountBadge extends StatelessWidget {
  const _CountBadge({
    required this.count,
    required this.accentColor,
    required this.isSelected,
    required this.isDark,
  });

  final int count;
  final Color accentColor;
  final bool isSelected;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
      decoration: BoxDecoration(
        color: isSelected
            ? accentColor.withValues(alpha: 0.3)
            : (isDark ? AppColors.darkSurface : AppColors.lightSurface),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        '$count',
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: isSelected
              ? accentColor
              : (isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary),
        ),
      ),
    );
  }
}
