import 'package:concept/shared/widgets/read_time_badge.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('ReadTimeBadge displays formatted read time', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ReadTimeBadge(seconds: 90),
        ),
      ),
    );

    expect(find.text('~90 sec read'), findsOneWidget);
    expect(find.byIcon(Icons.schedule_rounded), findsOneWidget);
  });

  testWidgets('ReadTimeBadge displays compact short duration', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ReadTimeBadge(seconds: 120, isCompact: true),
        ),
      ),
    );

    expect(find.text('2m'), findsOneWidget);
  });
}
