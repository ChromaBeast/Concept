import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../application/admin_providers.dart';
import 'widgets/image_queue_tab.dart';
import 'widgets/needs_review_tab.dart';

/// Admin dashboard for editorial review and image generation pipeline operations.
class AdminScreen extends ConsumerWidget {
  const AdminScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final reviewAsync = ref.watch(needsReviewConceptsProvider);
    final imageAsync = ref.watch(imageQueueConceptsProvider);

    final reviewCount = reviewAsync.asData?.value.length ?? 0;
    final imageCount = imageAsync.asData?.value.length ?? 0;

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Admin Operations'),
          bottom: TabBar(
            tabs: [
              Tab(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Needs Review'),
                    if (reviewCount > 0) ...[
                      const SizedBox(width: 6),
                      Badge.count(
                        count: reviewCount,
                        backgroundColor: Colors.amber,
                      ),
                    ],
                  ],
                ),
              ),
              Tab(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Image Queue'),
                    if (imageCount > 0) ...[
                      const SizedBox(width: 6),
                      Badge.count(
                        count: imageCount,
                        backgroundColor: Colors.purpleAccent,
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            NeedsReviewTab(),
            ImageQueueTab(),
          ],
        ),
      ),
    );
  }
}
