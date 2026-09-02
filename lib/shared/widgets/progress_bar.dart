import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

/// Smooth animated progress bar with category or brand gradient styling.
class ProgressBar extends StatelessWidget {
  const ProgressBar({
    super.key,
    required this.progress,
    this.height = 6.0,
    this.color,
    this.gradient,
    this.backgroundColor,
    this.borderRadius,
    this.animationDuration = const Duration(milliseconds: 350),
    this.curve = Curves.easeOutCubic,
    this.showLabel = false,
    this.customLabel,
  });

  /// Progress value between 0.0 and 1.0.
  final double progress;
  final double height;
  final Color? color;
  final Gradient? gradient;
  final Color? backgroundColor;
  final BorderRadius? borderRadius;
  final Duration animationDuration;
  final Curve curve;
  final bool showLabel;
  final String? customLabel;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final clampedProgress = progress.clamp(0.0, 1.0);
    final effectiveRadius = borderRadius ?? BorderRadius.circular(height / 2);

    final defaultBg = isDark
        ? AppColors.darkSurfaceVariant
        : AppColors.lightSurfaceVariant;
    final trackColor = backgroundColor ?? defaultBg;

    final defaultGradient = LinearGradient(
      colors: [
        color ?? AppColors.primary,
        color?.withValues(alpha: 0.8) ?? AppColors.primaryLight,
      ],
    );

    final effectiveGradient = color != null ? null : (gradient ?? defaultGradient);

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (showLabel) ...[
          _ProgressLabel(
            progress: clampedProgress,
            customLabel: customLabel,
            isDark: isDark,
          ),
          const SizedBox(height: 4),
        ],
        Container(
          height: height,
          decoration: BoxDecoration(
            color: trackColor,
            borderRadius: effectiveRadius,
          ),
          clipBehavior: Clip.antiAlias,
          child: TweenAnimationBuilder<double>(
            tween: Tween<double>(begin: 0.0, end: clampedProgress),
            duration: animationDuration,
            curve: curve,
            builder: (context, value, _) {
              return FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: value,
                child: Container(
                  decoration: BoxDecoration(
                    color: color,
                    gradient: effectiveGradient,
                    borderRadius: effectiveRadius,
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _ProgressLabel extends StatelessWidget {
  const _ProgressLabel({
    required this.progress,
    required this.customLabel,
    required this.isDark,
  });

  final double progress;
  final String? customLabel;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    final percent = (progress * 100).round();
    final text = customLabel ?? '$percent%';

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'Progress',
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w500,
            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
          ),
        ),
        Text(
          text,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
          ),
        ),
      ],
    );
  }
}
