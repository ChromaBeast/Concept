import 'package:concept/shared/widgets/progress_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('ProgressBar renders with given progress', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ProgressBar(
            progress: 0.75,
            showLabel: true,
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();
    expect(find.text('75%'), findsOneWidget);
    expect(find.text('Progress'), findsOneWidget);
  });
}
