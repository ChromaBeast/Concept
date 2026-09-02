import 'package:concept/data/models/quick_check.dart';
import 'package:concept/shared/widgets/quick_check_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('QuickCheckCard reveals and hides answer upon tap',
      (tester) async {
    const qc = QuickCheck(
      question: 'What is the time complexity of binary search?',
      answer: 'O(log n) because the search space is halved at each step.',
    );

    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: QuickCheckCard(
              quickCheck: qc,
            ),
          ),
        ),
      ),
    );

    expect(find.text(qc.question), findsOneWidget);
    expect(find.text('Reveal Answer'), findsOneWidget);

    await tester.tap(find.text('Reveal Answer'));
    await tester.pumpAndSettle();

    expect(find.text(qc.answer), findsOneWidget);
    expect(find.text('Hide Answer'), findsOneWidget);

    await tester.tap(find.text('Hide Answer'));
    await tester.pumpAndSettle();

    expect(find.text('Reveal Answer'), findsOneWidget);
  });
}
