import 'package:concept/data/models/enums.dart';
import 'package:concept/shared/widgets/category_chip.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('CategoryChip displays name and handles tap', (tester) async {
    var tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CategoryChip(
            category: Category.dsa,
            onTap: () => tapped = true,
          ),
        ),
      ),
    );

    expect(find.text(Category.dsa.label), findsOneWidget);
    await tester.tap(find.byType(CategoryChip));
    await tester.pumpAndSettle();
    expect(tapped, isTrue);
  });

  testWidgets('CategoryChip shows count badge when count is provided',
      (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: CategoryChip(
            category: Category.systemDesign,
            count: 42,
            isSelected: true,
          ),
        ),
      ),
    );

    expect(find.text('42'), findsOneWidget);
    expect(find.text(Category.systemDesign.label), findsOneWidget);
  });
}
