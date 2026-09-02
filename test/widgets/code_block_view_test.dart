import 'package:concept/shared/widgets/code_block_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('CodeBlockView displays language, lines, and copy button',
      (tester) async {
    const sampleCode = 'final x = 42;\nprint(x);';

    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: CodeBlockView(
            code: sampleCode,
            language: 'dart',
          ),
        ),
      ),
    );

    expect(find.text('DART'), findsOneWidget);
    expect(find.text('final x = 42;'), findsOneWidget);
    expect(find.text('print(x);'), findsOneWidget);
    expect(find.text('1'), findsOneWidget);
    expect(find.text('2'), findsOneWidget);
    expect(find.text('Copy'), findsOneWidget);

    await tester.tap(find.text('Copy'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 100));
    expect(find.text('Copied!'), findsOneWidget);

    await tester.pump(const Duration(seconds: 3));
    expect(find.text('Copy'), findsOneWidget);
  });
}
