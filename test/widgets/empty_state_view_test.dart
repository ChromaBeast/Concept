import 'package:concept/shared/widgets/empty_state_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('EmptyStateView displays title, description, and action button',
      (tester) async {
    var actionCalled = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: EmptyStateView(
            icon: Icons.bookmark_border_rounded,
            title: 'No Bookmarks Yet',
            description: 'Save your favorite concepts to access them offline.',
            actionLabel: 'Browse Concepts',
            onAction: () => actionCalled = true,
          ),
        ),
      ),
    );

    expect(find.text('No Bookmarks Yet'), findsOneWidget);
    expect(
      find.text('Save your favorite concepts to access them offline.'),
      findsOneWidget,
    );
    expect(find.text('Browse Concepts'), findsOneWidget);

    await tester.tap(find.text('Browse Concepts'));
    await tester.pumpAndSettle();
    expect(actionCalled, isTrue);
  });
}
