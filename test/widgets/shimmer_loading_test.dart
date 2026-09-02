import 'package:concept/shared/widgets/shimmer_loading.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('ConceptCardSkeleton and CourseCardSkeleton render without crashing',
      (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: Column(
              children: [
                ConceptCardSkeleton(),
                CourseCardSkeleton(),
                ConceptListSkeleton(itemCount: 2),
              ],
            ),
          ),
        ),
      ),
    );

    expect(find.byType(ConceptCardSkeleton), findsWidgets);
    expect(find.byType(CourseCardSkeleton), findsOneWidget);
    expect(find.byType(ConceptListSkeleton), findsOneWidget);
  });
}
