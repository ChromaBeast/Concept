import 'package:concept/data/models/enums.dart';
import 'package:concept/shared/widgets/difficulty_badge.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('DifficultyBadge displays beginner, intermediate, and advanced',
      (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: Column(
            children: [
              DifficultyBadge(difficulty: Difficulty.beginner),
              DifficultyBadge(difficulty: Difficulty.intermediate),
              DifficultyBadge(difficulty: Difficulty.advanced),
            ],
          ),
        ),
      ),
    );

    expect(find.text('Beginner'), findsOneWidget);
    expect(find.text('Intermediate'), findsOneWidget);
    expect(find.text('Advanced'), findsOneWidget);
  });
}
