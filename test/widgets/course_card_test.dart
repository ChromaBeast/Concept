import 'package:concept/data/models/course.dart';
import 'package:concept/data/models/enums.dart';
import 'package:concept/shared/widgets/course_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final sampleCourse = Course(
    id: 'course-1',
    slug: 'system-design-fundamentals',
    title: 'System Design Fundamentals',
    description: 'Master core principles of scalable distributed systems.',
    primaryCategory: Category.systemDesign,
    difficulty: Difficulty.intermediate,
    conceptIds: const ['c1', 'c2', 'c3', 'c4'],
    totalReadSeconds: 1200,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  );

  testWidgets('CourseCard displays course info and handles tap', (tester) async {
    var tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: CourseCard(
              course: sampleCourse,
              onTap: () => tapped = true,
              progress: 0.5,
              showProgress: true,
            ),
          ),
        ),
      ),
    );

    expect(find.text('System Design Fundamentals'), findsOneWidget);
    expect(find.text('Master core principles of scalable distributed systems.'), findsOneWidget);
    expect(find.text('4 concepts'), findsOneWidget);
    expect(find.text('20 mins'), findsOneWidget);
    expect(find.text('Intermediate'), findsOneWidget);
    expect(find.text('50%'), findsOneWidget);

    await tester.tap(find.text('System Design Fundamentals'));
    await tester.pumpAndSettle();
    expect(tapped, isTrue);
  });
}
