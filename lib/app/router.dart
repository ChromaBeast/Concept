import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/admin/presentation/admin_screen.dart';
import '../features/bookmarks/presentation/bookmarks_screen.dart';
import '../features/browse/presentation/browse_screen.dart';
import '../features/concept_detail/presentation/concept_detail_screen.dart';
import '../features/courses/presentation/course_detail_screen.dart';
import '../features/courses/presentation/courses_screen.dart';
import '../features/home/presentation/home_screen.dart';
import '../features/profile/presentation/profile_screen.dart';
import '../features/search/presentation/search_screen.dart';
import '../shared/widgets/app_nav_scaffold.dart';

/// Route constants and path helpers for the Concept application.
abstract final class AppRoutes {
  static const home = '/home';
  static const browse = '/browse';
  static const courses = '/courses';
  static const bookmarks = '/bookmarks';
  static const profile = '/profile';
  static const search = '/search';
  static const admin = '/admin';

  static String concept(String id, {String? courseId}) {
    if (courseId != null && courseId.isNotEmpty) {
      return '/concept/$id?courseId=$courseId';
    }
    return '/concept/$id';
  }

  static String course(String id) => '/course/$id';
}

final GlobalKey<NavigatorState> _rootNavigatorKey =
    GlobalKey<NavigatorState>(debugLabel: 'root');
final GlobalKey<NavigatorState> _shellNavigatorKey =
    GlobalKey<NavigatorState>(debugLabel: 'shell');

int _calculateSelectedIndex(String location) {
  if (location.startsWith(AppRoutes.browse)) return 1;
  if (location.startsWith(AppRoutes.courses)) return 2;
  if (location.startsWith(AppRoutes.bookmarks)) return 3;
  if (location.startsWith(AppRoutes.profile)) return 4;
  return 0; // Home is default
}

void _onTabSelected(BuildContext context, int index) {
  switch (index) {
    case 0:
      context.go(AppRoutes.home);
      break;
    case 1:
      context.go(AppRoutes.browse);
      break;
    case 2:
      context.go(AppRoutes.courses);
      break;
    case 3:
      context.go(AppRoutes.bookmarks);
      break;
    case 4:
      context.go(AppRoutes.profile);
      break;
  }
}

/// Factory function creating a new GoRouter instance.
GoRouter createAppRouter({
  String initialLocation = AppRoutes.home,
  GlobalKey<NavigatorState>? rootNavigatorKey,
  GlobalKey<NavigatorState>? shellNavigatorKey,
}) {
  final rootKey = rootNavigatorKey ?? GlobalKey<NavigatorState>(debugLabel: 'root');
  final shellKey = shellNavigatorKey ?? GlobalKey<NavigatorState>(debugLabel: 'shell');

  return GoRouter(
    navigatorKey: rootKey,
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: '/',
        redirect: (context, state) => AppRoutes.home,
      ),
      ShellRoute(
        navigatorKey: shellKey,
        builder: (context, state, child) {
          final selectedIndex = _calculateSelectedIndex(state.uri.path);
          return AppNavScaffold(
            currentIndex: selectedIndex,
            onTabSelected: (index) => _onTabSelected(context, index),
            child: child,
          );
        },
        routes: [
          GoRoute(
            path: AppRoutes.home,
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: AppRoutes.browse,
            builder: (context, state) => const BrowseScreen(),
          ),
          GoRoute(
            path: AppRoutes.courses,
            builder: (context, state) => const CoursesScreen(),
          ),
          GoRoute(
            path: AppRoutes.bookmarks,
            builder: (context, state) => const BookmarksScreen(),
          ),
          GoRoute(
            path: AppRoutes.profile,
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
      GoRoute(
        parentNavigatorKey: rootKey,
        path: '/concept/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          final courseId = state.uri.queryParameters['courseId'];
          return ConceptDetailScreen(
            conceptId: id,
            courseId: courseId,
          );
        },
      ),
      GoRoute(
        parentNavigatorKey: rootKey,
        path: '/course/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return CourseDetailScreen(
            courseId: id,
          );
        },
      ),
      GoRoute(
        parentNavigatorKey: rootKey,
        path: AppRoutes.search,
        builder: (context, state) {
          final query = state.uri.queryParameters['q'];
          return SearchScreen(
            initialQuery: query,
          );
        },
      ),
      GoRoute(
        parentNavigatorKey: rootKey,
        path: AppRoutes.admin,
        builder: (context, state) => const AdminScreen(),
      ),
    ],
  );
}

/// Default global GoRouter instance.
final GoRouter appRouter = createAppRouter(
  rootNavigatorKey: _rootNavigatorKey,
  shellNavigatorKey: _shellNavigatorKey,
);
