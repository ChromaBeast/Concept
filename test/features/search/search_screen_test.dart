import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:concept/features/search/presentation/search_screen.dart';
import 'package:concept/features/search/presentation/widgets/search_bar_widget.dart';
import 'package:concept/features/search/presentation/widgets/trending_tags_grid.dart';
import 'package:concept/shared/widgets/concept_card.dart';
import '../test_helpers.dart';

void main() {
  group('SearchScreen Tests', () {
    late TestEnvironment env;

    setUp(() async {
      env = await TestEnvironment.create();
    });

    tearDown(() async {
      await env.dispose();
    });

    testWidgets('renders search bar and trending tags initially',
        (tester) async {
      await pumpTestWidget(
        tester,
        const SearchScreen(),
        overrides: env.overrides,
      );

      expect(find.byType(SearchBarWidget), findsOneWidget);
      expect(find.byType(TrendingTagsGrid), findsOneWidget);
      expect(find.text('Popular Tags'), findsOneWidget);
    });

    testWidgets('searches concepts and displays result cards', (tester) async {
      await pumpTestWidget(
        tester,
        const SearchScreen(),
        overrides: env.overrides,
      );

      final searchField = find.byType(TextField);
      expect(searchField, findsOneWidget);

      await tester.enterText(searchField, 'binary');
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));

      expect(find.byType(ConceptCard), findsWidgets);
    });
  });
}
