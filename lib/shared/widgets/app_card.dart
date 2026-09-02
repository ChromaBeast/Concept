import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

/// Base card widget with optional category accent stripe on the left edge,
/// smooth tap handling, and configurable styling.
class AppCard extends StatelessWidget {
  const AppCard({
    super.key,
    required this.child,
    this.onTap,
    this.onLongPress,
    this.accentColor,
    this.accentStripeWidth = 4.0,
    this.padding = const EdgeInsets.all(16.0),
    this.margin = EdgeInsets.zero,
    this.borderRadius = 14.0,
    this.backgroundColor,
    this.borderColor,
    this.borderWidth = 1.0,
    this.elevation = 0.0,
  });

  final Widget child;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final Color? accentColor;
  final double accentStripeWidth;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry margin;
  final double borderRadius;
  final Color? backgroundColor;
  final Color? borderColor;
  final double borderWidth;
  final double elevation;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final defaultBg = isDark ? AppColors.darkCard : AppColors.lightCard;
    final defaultBorder = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final effectiveBg = backgroundColor ?? defaultBg;
    final effectiveBorder = borderColor ?? defaultBorder;
    final radius = BorderRadius.circular(borderRadius);

    return Padding(
      padding: margin,
      child: Material(
        color: effectiveBg,
        elevation: elevation,
        shape: RoundedRectangleBorder(
          borderRadius: radius,
          side: BorderSide(
            color: effectiveBorder,
            width: borderWidth,
          ),
        ),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          onLongPress: onLongPress,
          borderRadius: radius,
          splashColor: (accentColor ?? AppColors.primary).withValues(alpha: 0.12),
          highlightColor: (accentColor ?? AppColors.primary).withValues(alpha: 0.06),
          child: Container(
            decoration: accentColor != null
                ? BoxDecoration(
                    border: Border(
                      left: BorderSide(
                        color: accentColor!,
                        width: accentStripeWidth,
                      ),
                    ),
                  )
                : null,
            padding: padding,
            child: child,
          ),
        ),
      ),
    );
  }
}
