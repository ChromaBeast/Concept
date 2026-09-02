import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

/// Navigation scaffold wrapping the main 5 tabs with a bottom navigation bar:
/// Home, Browse, Courses, Bookmarks, Profile.
class AppNavScaffold extends StatelessWidget {
  const AppNavScaffold({
    super.key,
    required this.child,
    required this.currentIndex,
    required this.onTabSelected,
  });

  final Widget child;
  final int currentIndex;
  final ValueChanged<int> onTabSelected;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final navBg = isDark ? AppColors.darkSurface : AppColors.lightSurface;
    final topBorderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final activeColor = isDark ? AppColors.primaryLight : AppColors.primary;
    final inactiveColor = isDark ? AppColors.darkTextTertiary : AppColors.lightTextTertiary;

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: navBg,
          border: Border(
            top: BorderSide(
              color: topBorderColor,
              width: 0.8,
            ),
          ),
        ),
        child: SafeArea(
          top: false,
          child: BottomNavigationBar(
            currentIndex: currentIndex,
            onTap: onTabSelected,
            type: BottomNavigationBarType.fixed,
            backgroundColor: navBg,
            elevation: 0,
            selectedItemColor: activeColor,
            unselectedItemColor: inactiveColor,
            selectedFontSize: 11.5,
            unselectedFontSize: 11.5,
            selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600),
            unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500),
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.home_outlined),
                activeIcon: Icon(Icons.home_rounded),
                label: 'Home',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.explore_outlined),
                activeIcon: Icon(Icons.explore_rounded),
                label: 'Browse',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.school_outlined),
                activeIcon: Icon(Icons.school_rounded),
                label: 'Courses',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.bookmark_outline_rounded),
                activeIcon: Icon(Icons.bookmark_rounded),
                label: 'Bookmarks',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_outline_rounded),
                activeIcon: Icon(Icons.person_rounded),
                label: 'Profile',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
