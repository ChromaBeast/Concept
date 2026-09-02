import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/theme/app_theme.dart';
import 'router.dart';

/// State provider for application theme mode (defaults to dark mode).
final themeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.dark);

/// Root widget for the Concept application configured with Riverpod,
/// GoRouter, and dark/light themes.
class ConceptApp extends ConsumerWidget {
  const ConceptApp({
    super.key,
    this.router,
    this.themeMode,
  });

  final GoRouter? router;
  final ThemeMode? themeMode;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentThemeMode = themeMode ?? ref.watch(themeModeProvider);
    final effectiveRouter = router ?? appRouter;

    return MaterialApp.router(
      title: 'Concept - Dev Microlearning',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: currentThemeMode,
      routerConfig: effectiveRouter,
    );
  }
}

/// Convenience root wrapper providing the [ProviderScope] for [ConceptApp].
class ConceptRootApp extends StatelessWidget {
  const ConceptRootApp({
    super.key,
    this.overrides = const [],
    this.router,
    this.themeMode,
  });

  final List<Override> overrides;
  final GoRouter? router;
  final ThemeMode? themeMode;

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      overrides: overrides,
      child: ConceptApp(
        router: router,
        themeMode: themeMode,
      ),
    );
  }
}
