import 'package:flutter_test/flutter_test.dart';
import 'package:concept/features/profile/presentation/profile_screen.dart';
import 'package:concept/features/profile/presentation/widgets/category_stats_list.dart';
import 'package:concept/features/profile/presentation/widgets/streak_calendar_view.dart';
import 'package:concept/features/profile/presentation/widgets/theme_mode_selector.dart';
import '../test_helpers.dart';

void main() {
  group('ProfileScreen Tests', () {
    late TestEnvironment env;

    setUp(() async {
      env = await TestEnvironment.create();
    });

    tearDown(() async {
      await env.dispose();
    });

    testWidgets('renders streak view, theme selector, and category stats',
        (tester) async {
      await pumpTestWidget(
        tester,
        const ProfileScreen(),
        overrides: env.overrides,
      );

      expect(find.text('My Learning Profile'), findsOneWidget);
      expect(find.text('Software Engineer'), findsOneWidget);
      expect(find.byType(StreakCalendarView), findsOneWidget);
      expect(find.byType(ThemeModeSelector), findsOneWidget);
      expect(find.byType(CategoryStatsList), findsOneWidget);
    });

    testWidgets('switches theme mode on theme selector', (tester) async {
      await pumpTestWidget(
        tester,
        const ProfileScreen(),
        overrides: env.overrides,
      );

      final lightThemeBtn = find.text('Light');
      expect(lightThemeBtn, findsOneWidget);

      await tester.tap(lightThemeBtn);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 50));

      expect(find.byType(ThemeModeSelector), findsOneWidget);
    });
  });
}
