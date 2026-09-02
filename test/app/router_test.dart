import 'dart:io';
import 'package:concept/app/app.dart';
import 'package:concept/app/router.dart';
import 'package:concept/data/data.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';

void main() {
  test('AppRoutes helper generates correct URLs', () {
    expect(AppRoutes.home, equals('/home'));
    expect(AppRoutes.browse, equals('/browse'));
    expect(AppRoutes.courses, equals('/courses'));
    expect(AppRoutes.bookmarks, equals('/bookmarks'));
    expect(AppRoutes.profile, equals('/profile'));
    expect(AppRoutes.search, equals('/search'));
    expect(AppRoutes.admin, equals('/admin'));

    expect(AppRoutes.concept('binary-search'), equals('/concept/binary-search'));
    expect(
      AppRoutes.concept('binary-search', courseId: 'dsa-101'),
      equals('/concept/binary-search?courseId=dsa-101'),
    );
    expect(AppRoutes.course('sys-design-1'), equals('/course/sys-design-1'));
  });

  testWidgets('ConceptRootApp navigates through shell tabs and detail routes',
      (tester) async {
    final tempDir = Directory.systemTemp.createTempSync('concept_router_test_');
    Hive.init(tempDir.path);
    final cache = CacheService();
    await cache.init();
    const seed = SeedDataService();
    await seed.seedIfEmpty(cache);

    final testRouter = createAppRouter();
    await tester.pumpWidget(
      ConceptRootApp(
        router: testRouter,
        overrides: [
          cacheServiceProvider.overrideWithValue(cache),
        ],
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));

    expect(find.text('CONCEPT'), findsOneWidget);

    testRouter.go(AppRoutes.browse);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));
    expect(find.text('Browse Concepts'), findsOneWidget);

    testRouter.go(AppRoutes.courses);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));
    expect(find.text('Courses & Tracks'), findsOneWidget);

    testRouter.go(AppRoutes.bookmarks);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));
    expect(find.text('Saved Concepts'), findsOneWidget);

    testRouter.go(AppRoutes.profile);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));
    expect(find.text('My Learning Profile'), findsOneWidget);

    final testConcept = cache.getConcepts().first;
    testRouter.go(AppRoutes.concept(testConcept.id));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));
    expect(find.text(testConcept.title), findsWidgets);

    final testCourse = cache.getCourses().first;
    testRouter.go(AppRoutes.course(testCourse.id));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));
    expect(find.text(testCourse.title), findsWidgets);

    testRouter.go(AppRoutes.admin);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));
    expect(find.text('Admin Operations'), findsOneWidget);

    await Hive.close();
    if (tempDir.existsSync()) {
      tempDir.deleteSync(recursive: true);
    }
  });
}
