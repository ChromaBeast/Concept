import 'package:flutter_test/flutter_test.dart';
import 'package:concept/features/bookmarks/presentation/bookmarks_screen.dart';
import 'package:concept/shared/widgets/concept_card.dart';
import 'package:concept/shared/widgets/empty_state_view.dart';
import '../test_helpers.dart';

void main() {
  group('BookmarksScreen Tests', () {
    late TestEnvironment env;

    setUp(() async {
      env = await TestEnvironment.create();
    });

    tearDown(() async {
      await env.dispose();
    });

    testWidgets('renders empty state when no concepts are bookmarked',
        (tester) async {
      await pumpTestWidget(
        tester,
        const BookmarksScreen(),
        overrides: env.overrides,
      );

      expect(find.text('Saved Concepts'), findsOneWidget);
      expect(find.byType(EmptyStateView), findsOneWidget);
      expect(find.text('No bookmarks yet'), findsOneWidget);
    });

    testWidgets('renders bookmarked concept card when user has bookmarks',
        (tester) async {
      final concepts = env.cacheService.getConcepts();
      final testConcept = concepts.first;

      await env.cacheService.recordDailyStreak('default_user');
      final profile = env.cacheService.getUserProfile('default_user');
      await env.cacheService.saveUserProfile(
        profile.copyWith(bookmarkedConceptIds: [testConcept.id]),
      );

      await pumpTestWidget(
        tester,
        const BookmarksScreen(),
        overrides: env.overrides,
      );

      expect(find.text('Saved Concepts'), findsOneWidget);
      expect(find.byType(ConceptCard), findsOneWidget);
      expect(find.text(testConcept.title), findsOneWidget);
    });
  });
}
