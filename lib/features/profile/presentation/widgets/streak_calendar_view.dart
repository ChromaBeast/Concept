import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/user_profile.dart';
import '../../../../shared/widgets/app_card.dart';

/// Card showing streak metrics, total learned count, and bookmarks count.
class StreakCalendarView extends StatelessWidget {
  const StreakCalendarView({
    super.key,
    required this.profile,
  });

  final UserProfile profile;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: AppCard(
        accentColor: AppColors.catOperatingSystems,
        padding: const EdgeInsets.all(18),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.catOperatingSystems.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(
                    Icons.local_fire_department_rounded,
                    color: AppColors.catOperatingSystems,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${profile.streakCount} Day Streak',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: isDark
                              ? AppColors.darkTextPrimary
                              : AppColors.lightTextPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        profile.streakCount > 0
                            ? 'Keep learning daily to maintain your momentum!'
                            : 'Learn a concept today to start your streak!',
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark
                              ? AppColors.darkTextSecondary
                              : AppColors.lightTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Divider(
              color: isDark ? AppColors.darkBorderSubtle : AppColors.lightBorderSubtle,
              height: 1,
            ),
            const SizedBox(height: 14),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _StatItem(
                  icon: Icons.check_circle_rounded,
                  color: AppColors.success,
                  count: '${profile.learnedConceptIds.length}',
                  label: 'Learned',
                  isDark: isDark,
                ),
                _StatItem(
                  icon: Icons.bookmark_rounded,
                  color: AppColors.primaryLight,
                  count: '${profile.bookmarkedConceptIds.length}',
                  label: 'Bookmarked',
                  isDark: isDark,
                ),
                _StatItem(
                  icon: Icons.bolt_rounded,
                  color: AppColors.warning,
                  count: '${profile.streakCount}',
                  label: 'Day Streak',
                  isDark: isDark,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  const _StatItem({
    required this.icon,
    required this.color,
    required this.count,
    required this.label,
    required this.isDark,
  });

  final IconData icon;
  final Color color;
  final String count;
  final String label;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 4),
            Text(
              count,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.w500,
            color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
          ),
        ),
      ],
    );
  }
}
