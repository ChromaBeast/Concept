import 'package:concept/data/models/concept.dart';
import 'package:concept/data/models/concept_body.dart';
import 'package:concept/data/models/enums.dart';
import 'package:concept/shared/widgets/concept_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final sampleConcept = Concept(
    id: 'c1',
    slug: 'binary-search',
    title: 'Binary Search',
    oneLiner: 'Efficiently find items in sorted lists in O(log n).',
    category: Category.dsa,
    difficulty: Difficulty.beginner,
    estimatedReadSeconds: 90,
    askedByCompanies: const ['Google', 'Meta'],
    body: const ConceptBody(
      definition: 'A search algorithm that divides the array in half.',
      whyItMatters: 'Fundamental algorithmic technique.',
      example: 'Searching in a phonebook.',
    ),
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  );

  testWidgets('ConceptCard renders title, category, difficulty, read time',
      (tester) async {
    var tapped = false;
    var bookmarkToggled = false;
    var learnedToggled = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: ConceptCard(
              concept: sampleConcept,
              onTap: () => tapped = true,
              isBookmarked: false,
              onBookmarkToggle: (val) => bookmarkToggled = val,
              isLearned: false,
              onLearnedToggle: (val) => learnedToggled = val,
            ),
          ),
        ),
      ),
    );

    expect(find.text('Binary Search'), findsOneWidget);
    expect(find.text('Data Structures & Algorithms'), findsOneWidget);
    expect(find.text('Beginner'), findsOneWidget);
    expect(find.text('~90 sec read'), findsOneWidget);
    expect(find.text('2 co.'), findsOneWidget);

    await tester.tap(find.text('Binary Search'));
    await tester.pumpAndSettle();
    expect(tapped, isTrue);

    await tester.tap(find.byTooltip('Bookmark'));
    await tester.pumpAndSettle();
    expect(bookmarkToggled, isTrue);

    await tester.tap(find.byTooltip('Mark as learned'));
    await tester.pumpAndSettle();
    expect(learnedToggled, isTrue);
  });
}
