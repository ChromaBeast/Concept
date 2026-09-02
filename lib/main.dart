import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'app/app.dart';
import 'data/data.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize local Hive storage engine
  await Hive.initFlutter();

  // Initialize local CacheService and seed dataset if first run
  await globalCacheService.init();
  await globalSeedDataService.seedIfEmpty(globalCacheService);

  // Record daily streak for default user
  final userRepo = UserRepository(cacheService: globalCacheService);
  await userRepo.recordDailyStreak('default_user');

  // Determine initial theme mode
  final savedTheme = globalCacheService.getThemeMode();
  final initialTheme = switch (savedTheme) {
    'light' => ThemeMode.light,
    'dark' => ThemeMode.dark,
    _ => ThemeMode.system,
  };

  runApp(
    ConceptRootApp(
      themeMode: initialTheme,
    ),
  );
}
