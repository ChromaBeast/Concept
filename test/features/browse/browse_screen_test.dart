import 'package:flutter_test/flutter_test.dart';
import 'package:concept/features/browse/presentation/browse_screen.dart';
import 'package:concept/features/browse/presentation/widgets/browse_filter_bar.dart';
import 'package:concept/features/browse/presentation/widgets/category_grid.dart';
import 'package:concept/features/browse/presentation/widgets/concepts_list_view.dart';
import '../test_helpers.dart';

void main() {
  group('BrowseScreen Tests', () {
    late TestEnvironment env;

    setUp(() async {
      env = await TestEnvironment.create();
    });

    tearDown(() async {
      await env.dispose();
    });

    testWidgets('renders filter bar, category grid, and concepts list',
        (tester) async {
      await pumpTestWidget(
        tester,
        const BrowseScreen(),
        overrides: env.overrides,
      );

      expect(find.text('Browse Concepts'), findsOneWidget);
      expect(find.byType(BrowseFilterBar), findsOneWidget);
      expect(find.byType(CategoryGrid), findsOneWidget);
      expect(find.byType(ConceptsListView), findsOneWidget);
    });

    testWidgets('filters concepts when difficulty is tapped', (tester) async {
      await pumpTestWidget(
        tester,
        const BrowseScreen(),
        overrides: env.overrides,
      );

      final beginnerChip = find.text('Beginner');
      expect(beginnerChip, findsWidgets);

      await tester.tap(beginnerChip.first);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 50));

      expect(find.byType(ConceptsListView), findsOneWidget);
    });
  });
}
