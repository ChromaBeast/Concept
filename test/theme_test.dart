import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:concept/core/theme/theme.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Theme & Typography Tests', () {
    testWidgets('Dark theme configures correct brightness and colors', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.darkTheme,
          home: const Scaffold(body: Text('Test')),
        ),
      );
      final dark = AppTheme.darkTheme;
      expect(dark.brightness, Brightness.dark);
      expect(dark.scaffoldBackgroundColor, AppColors.darkBackground);
      expect(dark.cardColor, AppColors.darkCard);
    });

    testWidgets('Light theme configures correct brightness and colors', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.lightTheme,
          home: const Scaffold(body: Text('Test')),
        ),
      );
      final light = AppTheme.lightTheme;
      expect(light.brightness, Brightness.light);
      expect(light.scaffoldBackgroundColor, AppColors.lightBackground);
      expect(light.cardColor, AppColors.lightCard);
    });

    testWidgets('Typography has valid text theme configuration', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.darkTheme,
          home: Builder(
            builder: (context) {
              final textTheme = Theme.of(context).textTheme;
              expect(textTheme.bodyLarge, isNotNull);
              expect(textTheme.titleLarge, isNotNull);
              return const SizedBox();
            },
          ),
        ),
      );
    });
  });
}
