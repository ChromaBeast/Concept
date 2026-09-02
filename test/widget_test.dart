import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:concept/app/app.dart';
import 'package:concept/data/data.dart';

void main() {
  testWidgets('ConceptRootApp smoke test', (WidgetTester tester) async {
    final tempDir = Directory.systemTemp.createTempSync('concept_smoke_test_');
    Hive.init(tempDir.path);
    final cache = CacheService();
    await cache.init();
    const seed = SeedDataService();
    await seed.seedIfEmpty(cache);

    await tester.pumpWidget(
      ConceptRootApp(
        overrides: [
          cacheServiceProvider.overrideWithValue(cache),
        ],
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 50));

    expect(find.text('CONCEPT'), findsOneWidget);

    await Hive.close();
    if (tempDir.existsSync()) {
      tempDir.deleteSync(recursive: true);
    }
  });
}
