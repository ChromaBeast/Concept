import 'package:concept/shared/widgets/app_nav_scaffold.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('AppNavScaffold displays 5 navigation tabs and switches',
      (tester) async {
    var selectedIndex = 0;

    await tester.pumpWidget(
      MaterialApp(
        home: StatefulBuilder(
          builder: (context, setState) {
            return AppNavScaffold(
              currentIndex: selectedIndex,
              onTabSelected: (index) {
                setState(() => selectedIndex = index);
              },
              child: Center(
                child: Text('Current Tab: $selectedIndex'),
              ),
            );
          },
        ),
      ),
    );

    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Browse'), findsOneWidget);
    expect(find.text('Courses'), findsOneWidget);
    expect(find.text('Bookmarks'), findsOneWidget);
    expect(find.text('Profile'), findsOneWidget);
    expect(find.text('Current Tab: 0'), findsOneWidget);

    await tester.tap(find.text('Courses'));
    await tester.pumpAndSettle();
    expect(selectedIndex, equals(2));
    expect(find.text('Current Tab: 2'), findsOneWidget);
  });
}
