import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/data_providers.dart';
import '../../../../data/models/enums.dart';
import '../../../../data/models/models.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/empty_state_view.dart';
import '../../application/admin_providers.dart';

/// Tab showing editorial review queue with word budget retry and publish actions.
class NeedsReviewTab extends ConsumerWidget {
  const NeedsReviewTab({super.key});

  Future<void> _retryCheck(BuildContext context, WidgetRef ref, String id) async {
    final updated = await ref.read(adminRepositoryProvider).retryConceptCheck(id);
    ref.invalidate(needsReviewConceptsProvider);
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            updated?.status == ContentStatus.published
                ? 'Concept validated & published!'
                : 'Concept still has validation issues.',
          ),
          backgroundColor: updated?.status == ContentStatus.published
              ? AppColors.success
              : AppColors.warning,
        ),
      );
    }
  }

  Future<void> _publish(BuildContext context, WidgetRef ref, String id) async {
    await ref
        .read(adminRepositoryProvider)
        .updateConceptStatus(id, ContentStatus.published);
    ref.invalidate(needsReviewConceptsProvider);
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Concept manually approved & published!'),
          backgroundColor: AppColors.success,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final listAsync = ref.watch(needsReviewConceptsProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return listAsync.when(
      data: (concepts) {
        if (concepts.isEmpty) {
          return const Center(
            child: EmptyStateView(
              icon: Icons.check_circle_outline_rounded,
              title: 'Review queue clean',
              description: 'No concepts require editorial or quality review.',
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: concepts.length,
          itemBuilder: (context, index) {
            final c = concepts[index];
            final reasons = c.needsReviewReasons ?? const [];

            return AppCard(
              accentColor: AppColors.warning,
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          c.title,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: isDark
                                ? AppColors.darkTextPrimary
                                : AppColors.lightTextPrimary,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.warning.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          c.status.value.toUpperCase(),
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.warning,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    c.oneLiner,
                    style: TextStyle(
                      fontSize: 12.5,
                      color: isDark
                          ? AppColors.darkTextSecondary
                          : AppColors.lightTextSecondary,
                    ),
                  ),
                  if (reasons.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.error.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: AppColors.error.withValues(alpha: 0.2),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: reasons.map((r) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 2),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Icon(
                                  Icons.error_outline_rounded,
                                  size: 13,
                                  color: AppColors.error,
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    r,
                                    style: const TextStyle(
                                      fontSize: 11.5,
                                      color: AppColors.error,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      OutlinedButton.icon(
                        onPressed: () => _retryCheck(context, ref, c.id),
                        icon: const Icon(Icons.refresh_rounded, size: 14),
                        label: const Text('Recheck Budget', style: TextStyle(fontSize: 12)),
                        style: OutlinedButton.styleFrom(
                          visualDensity: VisualDensity.compact,
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton.icon(
                        onPressed: () => _publish(context, ref, c.id),
                        icon: const Icon(Icons.check_rounded, size: 14),
                        label: const Text('Publish', style: TextStyle(fontSize: 12)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.success,
                          foregroundColor: Colors.white,
                          visualDensity: VisualDensity.compact,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Center(child: Text('Error: $e')),
    );
  }
}
