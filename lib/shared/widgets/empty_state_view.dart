import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

/// Clean, reusable empty state placeholder with icon, title, description,
/// and optional primary action button.
class EmptyStateView extends StatelessWidget {
  const EmptyStateView({
    super.key,
    required this.title,
    this.icon,
    this.iconWidget,
    this.description,
    this.actionLabel,
    this.onAction,
    this.accentColor,
    this.padding = const EdgeInsets.all(32.0),
  });

  final String title;
  final IconData? icon;
  final Widget? iconWidget;
  final String? description;
  final String? actionLabel;
  final VoidCallback? onAction;
  final Color? accentColor;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primaryColor = accentColor ?? AppColors.primary;

    return Center(
      child: Padding(
        padding: padding,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            _EmptyStateIconContainer(
              icon: icon,
              iconWidget: iconWidget,
              accentColor: primaryColor,
              isDark: isDark,
            ),
            const SizedBox(height: 20),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
              ),
            ),
            if (description != null) ...[
              const SizedBox(height: 8),
              Text(
                description!,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  height: 1.5,
                  color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                ),
              ),
            ],
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: 24),
              FilledButton(
                onPressed: onAction,
                style: FilledButton.styleFrom(
                  backgroundColor: primaryColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: Text(
                  actionLabel!,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _EmptyStateIconContainer extends StatelessWidget {
  const _EmptyStateIconContainer({
    required this.icon,
    required this.iconWidget,
    required this.accentColor,
    required this.isDark,
  });

  final IconData? icon;
  final Widget? iconWidget;
  final Color accentColor;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    final displayedWidget = iconWidget ??
        (icon != null
            ? Icon(
                icon,
                size: 32,
                color: accentColor,
              )
            : Icon(
                Icons.inbox_rounded,
                size: 32,
                color: accentColor,
              ));

    return Container(
      width: 72,
      height: 72,
      decoration: BoxDecoration(
        color: accentColor.withValues(alpha: isDark ? 0.15 : 0.10),
        shape: BoxShape.circle,
        border: Border.all(
          color: accentColor.withValues(alpha: 0.25),
          width: 1,
        ),
      ),
      alignment: Alignment.center,
      child: displayedWidget,
    );
  }
}
