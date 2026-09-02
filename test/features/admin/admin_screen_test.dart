import 'package:flutter_test/flutter_test.dart';
import 'package:concept/features/admin/presentation/admin_screen.dart';
import 'package:concept/features/admin/presentation/widgets/image_queue_tab.dart';
import 'package:concept/features/admin/presentation/widgets/needs_review_tab.dart';
import '../test_helpers.dart';

void main() {
  group('AdminScreen Tests', () {
    late TestEnvironment env;

    setUp(() async {
      env = await TestEnvironment.create();
    });

    tearDown(() async {
      await env.dispose();
    });

    testWidgets('renders TabBar with Needs Review and Image Queue tabs',
        (tester) async {
      await pumpTestWidget(
        tester,
        const AdminScreen(),
        overrides: env.overrides,
      );

      expect(find.text('Admin Operations'), findsOneWidget);
      expect(find.text('Needs Review'), findsOneWidget);
      expect(find.text('Image Queue'), findsOneWidget);
      expect(find.byType(NeedsReviewTab), findsOneWidget);
    });

    testWidgets('switches to Image Queue tab', (tester) async {
      await pumpTestWidget(
        tester,
        const AdminScreen(),
        overrides: env.overrides,
      );

      final imageTab = find.text('Image Queue');
      expect(imageTab, findsOneWidget);

      await tester.tap(imageTab);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 50));

      expect(find.byType(ImageQueueTab), findsOneWidget);
    });
  });
}
