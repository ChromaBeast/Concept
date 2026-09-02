import 'package:concept/shared/widgets/tag_chip.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('TagChip displays # prefix and label', (tester) async {
    var tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: TagChip(
            tag: 'binary-tree',
            onTap: () => tapped = true,
          ),
        ),
      ),
    );

    expect(find.text('#'), findsOneWidget);
    expect(find.text('binary-tree'), findsOneWidget);

    await tester.tap(find.byType(TagChip));
    await tester.pumpAndSettle();
    expect(tapped, isTrue);
  });

  testWidgets('TagChip handles delete action when onDeleted is provided',
      (tester) async {
    var deleted = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: TagChip(
            tag: '#recursion',
            onDeleted: () => deleted = true,
          ),
        ),
      ),
    );

    expect(find.text('recursion'), findsOneWidget);
    expect(find.byIcon(Icons.close_rounded), findsOneWidget);

    await tester.tap(find.byIcon(Icons.close_rounded));
    await tester.pumpAndSettle();
    expect(deleted, isTrue);
  });
}
