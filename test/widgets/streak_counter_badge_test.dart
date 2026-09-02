import 'package:concept/shared/widgets/streak_counter_badge.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('StreakCounterBadge displays streak count and handles tap',
      (tester) async {
    var tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StreakCounterBadge(
            streakCount: 7,
            onTap: () => tapped = true,
          ),
        ),
      ),
    );

    expect(find.text('7'), findsOneWidget);
    expect(find.byIcon(Icons.local_fire_department_rounded), findsOneWidget);

    await tester.tap(find.byType(StreakCounterBadge));
    await tester.pumpAndSettle();
    expect(tapped, isTrue);
  });
}
