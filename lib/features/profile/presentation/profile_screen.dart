import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../app/app.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/theme/app_colors.dart';
import '../../../data/data_providers.dart';
import '../../../data/models/user_profile.dart';
import '../application/profile_providers.dart';
import 'widgets/category_stats_list.dart';
import 'widgets/streak_calendar_view.dart';
import 'widgets/theme_mode_selector.dart';

/// User profile and learning dashboard screen.
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  void _onThemeChanged(WidgetRef ref, String mode) {
    ref.read(userProfileNotifierProvider.notifier).updateThemeMode(mode);
    switch (mode) {
      case 'light':
        ref.read(themeModeProvider.notifier).state = ThemeMode.light;
        break;
      case 'dark':
        ref.read(themeModeProvider.notifier).state = ThemeMode.dark;
        break;
      default:
        ref.read(themeModeProvider.notifier).state = ThemeMode.system;
        break;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(userProfileNotifierProvider);
    final statsAsync = ref.watch(categoryLearningStatsProvider);
    final userProfile =
        profileAsync.asData?.value ?? const UserProfile(userId: 'default_user');
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Learning Profile'),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.read(userProfileNotifierProvider.notifier).loadProfile();
          ref.invalidate(categoryLearningStatsProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 26,
                      backgroundColor: AppColors.primary,
                      child: const Icon(
                        Icons.person_rounded,
                        color: Colors.white,
                        size: 30,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Software Engineer',
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w800,
                            color: isDark
                                ? AppColors.darkTextPrimary
                                : AppColors.lightTextPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'User ID: ${userProfile.userId}',
                          style: TextStyle(
                            fontSize: 12,
                            color: isDark
                                ? AppColors.darkTextSecondary
                                : AppColors.lightTextSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              StreakCalendarView(profile: userProfile),
              ThemeModeSelector(
                currentMode: userProfile.themeMode,
                onModeChanged: (mode) => _onThemeChanged(ref, mode),
              ),
              statsAsync.when(
                data: (stats) => CategoryStatsList(stats: stats),
                loading: () => const Center(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: CircularProgressIndicator(),
                  ),
                ),
                error: (e, _) => Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Text('Error loading stats: $e'),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
                child: Center(
                  child: Text(
                    '${AppConstants.appName} v1.0.0+1 • Offline First',
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark
                          ? AppColors.darkTextTertiary
                          : AppColors.lightTextTertiary,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
