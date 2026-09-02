import 'package:flutter_test/flutter_test.dart';
import 'package:concept/features/courses/presentation/course_detail_screen.dart';
import 'package:concept/features/courses/presentation/courses_screen.dart';
import 'package:concept/features/courses/presentation/widgets/course_header.dart';
import 'package:concept/shared/widgets/course_card.dart';
import '../test_helpers.dart';

void main() {
  group('Courses Feature Tests', () {
    late TestEnvironment env;

    setUp(() async {
      env = await TestEnvironment.create();
    });

    tearDown(() async {
      await env.dispose();
    });

    testWidgets('CoursesScreen renders course catalog and cards',
        (tester) async {
      await pumpTestWidget(
        tester,
        const CoursesScreen(),
        overrides: env.overrides,
      );

      expect(find.text('Courses & Tracks'), findsOneWidget);
      expect(find.text('All Tracks'), findsOneWidget);
      expect(find.byType(CourseCard), findsWidgets);
    });

    testWidgets('CourseDetailScreen renders course header and curriculum',
        (tester) async {
      final courses = env.cacheService.getCourses();
      final testCourse = courses.first;

      await pumpTestWidget(
        tester,
        CourseDetailScreen(courseId: testCourse.id),
        overrides: env.overrides,
      );

      expect(find.text('Course Details'), findsOneWidget);
      expect(find.byType(CourseHeader), findsOneWidget);
      expect(find.text('Curriculum'), findsOneWidget);
      expect(find.text(testCourse.title), findsOneWidget);
    });
  });
}
