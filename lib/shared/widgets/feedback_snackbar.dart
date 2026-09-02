import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

/// Reusable toast/snackbar helper providing instant feedback and undo actions.
class FeedbackSnackbar {
  const FeedbackSnackbar._();

  static void show({
    required BuildContext context,
    required String message,
    IconData? icon,
    String? actionLabel,
    VoidCallback? onAction,
    Duration duration = const Duration(seconds: 3),
  }) {
    final scaffoldMessenger = ScaffoldMessenger.maybeOf(context);
    if (scaffoldMessenger == null) return;

    scaffoldMessenger.hideCurrentSnackBar();

    final isDark = Theme.of(context).brightness == Brightness.dark;

    scaffoldMessenger.showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        duration: duration,
        elevation: 6,
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          side: BorderSide(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            width: 0.8,
          ),
        ),
        backgroundColor: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        content: Row(
          children: [
            if (icon != null) ...[
              Icon(
                icon,
                size: 18,
                color: AppColors.primaryLight,
              ),
              const SizedBox(width: 10),
            ],
            Expanded(
              child: Text(
                message,
                style: TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w500,
                  color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
                ),
              ),
            ),
          ],
        ),
        action: actionLabel != null && onAction != null
            ? SnackBarAction(
                label: actionLabel,
                textColor: AppColors.primaryLight,
                onPressed: onAction,
              )
            : null,
      ),
    );
  }

  static void showUndo({
    required BuildContext context,
    required String message,
    required VoidCallback onUndo,
  }) {
    show(
      context: context,
      message: message,
      icon: Icons.info_outline_rounded,
      actionLabel: 'UNDO',
      onAction: onUndo,
    );
  }
}
