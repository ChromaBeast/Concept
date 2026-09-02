import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/read_time_formatter.dart';

/// Subtle badge indicating estimated reading time with a timer icon.
class ReadTimeBadge extends StatelessWidget {
  const ReadTimeBadge({
    super.key,
    required this.seconds,
    this.isCompact = false,
    this.customText,
    this.color,
  });

  final int seconds;
  final bool isCompact;
  final String? customText;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final defaultColor =
        isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary;
    final effectiveColor = color ?? defaultColor;

    final text = customText ??
        (isCompact
            ? ReadTimeFormatter.formatShort(seconds)
            : ReadTimeFormatter.formatReadBadge(seconds));

    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Icon(
          Icons.schedule_rounded,
          size: isCompact ? 12 : 13.5,
          color: effectiveColor.withValues(alpha: 0.8),
        ),
        const SizedBox(width: 4),
        Text(
          text,
          style: TextStyle(
            fontSize: isCompact ? 11 : 12,
            fontWeight: FontWeight.w500,
            color: effectiveColor,
            letterSpacing: 0.1,
          ),
        ),
      ],
    );
  }
}
