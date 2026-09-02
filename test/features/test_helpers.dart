import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:concept/core/theme/app_theme.dart';
import 'package:concept/data/data.dart';

/// Test environment setup helper for Riverpod and Hive caching.
class TestEnvironment {
  TestEnvironment({required this.tempDir, required this.cacheService});

  final Directory tempDir;
  final CacheService cacheService;

  static Future<TestEnvironment> create() async {
    final tempDir = Directory.systemTemp.createTempSync('concept_test_env_');
    Hive.init(tempDir.path);
    final cache = CacheService();
    await cache.init();
    const seed = SeedDataService();
    await seed.seedIfEmpty(cache);
    return TestEnvironment(tempDir: tempDir, cacheService: cache);
  }

  Future<void> dispose() async {
    await Hive.close();
    if (tempDir.existsSync()) {
      tempDir.deleteSync(recursive: true);
    }
  }

  List<Override> get overrides => [
        cacheServiceProvider.overrideWithValue(cacheService),
      ];
}

/// Helper to pump a test widget wrapped with ProviderScope and MaterialApp.
Future<void> pumpTestWidget(
  WidgetTester tester,
  Widget child, {
  List<Override> overrides = const [],
}) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: overrides,
      child: MaterialApp(
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.dark,
        home: child,
      ),
    ),
  );
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 50));
}
