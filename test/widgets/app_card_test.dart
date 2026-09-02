import 'package:concept/core/theme/app_colors.dart';
import 'package:concept/shared/widgets/app_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('AppCard renders child and responds to tap', (tester) async {
    var tapped = false;

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: AppCard(
            onTap: () => tapped = true,
            child: const Text('Card Content'),
          ),
        ),
      ),
    );

    expect(find.text('Card Content'), findsOneWidget);
    await tester.tap(find.text('Card Content'));
    await tester.pumpAndSettle();
    expect(tapped, isTrue);
  });

  testWidgets('AppCard renders accent stripe when accentColor is provided',
      (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: AppCard(
            accentColor: AppColors.catDsa,
            accentStripeWidth: 5.0,
            child: Text('With Stripe'),
          ),
        ),
      ),
    );

    expect(find.text('With Stripe'), findsOneWidget);
    final stripeFinder = find.byType(Container);
    expect(stripeFinder, findsWidgets);
  });
}
