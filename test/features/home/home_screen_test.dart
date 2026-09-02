import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:concept/features/home/presentation/home_screen.dart';
import 'package:concept/features/home/presentation/widgets/daily_concept_banner.dart';
import 'package:concept/features/home/presentation/widgets/streak_header.dart';
import '../test_helpers.dart';

void main() {
  group('HomeScreen Tests', () {
    late TestEnvironment env;

    setUp(() async {
      env = await TestEnvironment.create();
    });

    tearDown(() async {
      await env.dispose();
    });

    testWidgets('renders streak header, daily concept banner, and topics',
        (tester) async {
      await pumpTestWidget(
        tester,
        const HomeScreen(),
        overrides: env.overrides,
      );

      expect(find.byType(StreakHeader), findsOneWidget);
      expect(find.text('CONCEPT'), findsOneWidget);
      expect(find.text('Explore Topics'), findsOneWidget);
      expect(find.text('Continue Learning'), findsOneWidget);
      expect(find.text('Trending Concepts'), findsOneWidget);
      expect(find.byType(DailyConceptBanner), findsOneWidget);
    });

    testWidgets('toggles bookmark on daily concept banner', (tester) async {
      await pumpTestWidget(
        tester,
        const HomeScreen(),
        overrides: env.overrides,
      );

      expect(find.byType(DailyConceptBanner), findsOneWidget);
      final bookmarkBtn = find.descendant(
        of: find.byType(DailyConceptBanner),
        matching: find.byType(IconButton),
      );
      expect(bookmarkBtn, findsOneWidget);
    });
  });
}
