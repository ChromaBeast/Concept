import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/streak_counter_badge.dart';

/// Top header for the Home Screen showing app brand, streak counter, and action buttons.
class StreakHeader extends StatelessWidget {
  const StreakHeader({
    super.key,
    required this.streakCount,
  });

  final int streakCount;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppColors.primary, AppColors.catSystemDesign],
                  ),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.terminal_rounded,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'CONCEPT',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                      color: isDark
                          ? AppColors.darkTextPrimary
                          : AppColors.lightTextPrimary,
                    ),
                  ),
                  Text(
                    'Microlearning for Engineers',
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark
                          ? AppColors.darkTextSecondary
                          : AppColors.lightTextSecondary,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              StreakCounterBadge(
                streakCount: streakCount,
                onTap: () => context.go(AppRoutes.profile),
              ),
              const SizedBox(width: 6),
              IconButton(
                icon: const Icon(Icons.search_rounded, size: 22),
                tooltip: 'Search Concepts',
                onPressed: () => context.push(AppRoutes.search),
              ),
              IconButton(
                icon: const Icon(Icons.admin_panel_settings_outlined, size: 20),
                tooltip: 'Admin Dashboard',
                onPressed: () => context.push(AppRoutes.admin),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
