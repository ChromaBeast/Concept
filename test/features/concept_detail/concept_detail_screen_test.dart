import 'package:flutter_test/flutter_test.dart';
import 'package:concept/features/concept_detail/presentation/concept_detail_screen.dart';
import 'package:concept/features/concept_detail/presentation/widgets/concept_definition_box.dart';
import 'package:concept/features/concept_detail/presentation/widgets/concept_example_box.dart';
import 'package:concept/features/concept_detail/presentation/widgets/concept_header_section.dart';
import 'package:concept/features/concept_detail/presentation/widgets/concept_hero_image.dart';
import 'package:concept/features/concept_detail/presentation/widgets/concept_why_matters_box.dart';
import 'package:concept/features/concept_detail/presentation/widgets/next_in_course_bar.dart';
import '../test_helpers.dart';

void main() {
  group('ConceptDetailScreen Tests', () {
    late TestEnvironment env;

    setUp(() async {
      env = await TestEnvironment.create();
    });

    tearDown(() async {
      await env.dispose();
    });

    testWidgets('renders all structured concept sections in order',
        (tester) async {
      final concepts = env.cacheService.getConcepts();
      final testConcept = concepts.first;

      await pumpTestWidget(
        tester,
        ConceptDetailScreen(conceptId: testConcept.id),
        overrides: env.overrides,
      );

      expect(find.byType(ConceptHeaderSection), findsOneWidget);
      expect(find.byType(ConceptDefinitionBox), findsOneWidget);
      expect(find.byType(ConceptWhyMattersBox), findsOneWidget);
      expect(find.byType(ConceptHeroImage), findsOneWidget);
      expect(find.byType(ConceptExampleBox), findsOneWidget);
      expect(find.byType(NextInCourseBar), findsOneWidget);
      expect(find.text(testConcept.title), findsWidgets);
    });

    testWidgets('toggles learned status on bottom bar', (tester) async {
      final concepts = env.cacheService.getConcepts();
      final testConcept = concepts.first;

      await pumpTestWidget(
        tester,
        ConceptDetailScreen(conceptId: testConcept.id),
        overrides: env.overrides,
      );

      final markLearnedBtn = find.text('Mark as Learned');
      expect(markLearnedBtn, findsOneWidget);

      await tester.tap(markLearnedBtn);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 50));

      expect(find.text('Learned'), findsOneWidget);
    });
  });
}
