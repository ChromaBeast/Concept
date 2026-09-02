import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/router.dart';
import '../../../../data/models/models.dart';
import '../../../../shared/widgets/concept_card.dart';
import '../../../../shared/widgets/empty_state_view.dart';

/// List view displaying concept cards or an empty state placeholder.
class ConceptsListView extends StatelessWidget {
  const ConceptsListView({
    super.key,
    required this.concepts,
    required this.bookmarkedIds,
    required this.learnedIds,
    required this.onBookmarkToggle,
    required this.onLearnedToggle,
    this.onResetFilters,
  });

  final List<Concept> concepts;
  final Set<String> bookmarkedIds;
  final Set<String> learnedIds;
  final void Function(String conceptId) onBookmarkToggle;
  final void Function(String conceptId) onLearnedToggle;
  final VoidCallback? onResetFilters;

  @override
  Widget build(BuildContext context) {
    if (concepts.isEmpty) {
      return Padding(
        padding: const EdgeInsets.all(24),
        child: EmptyStateView(
          icon: Icons.search_off_rounded,
          title: 'No concepts found',
          description: 'Try adjusting your filters or category selection.',
          actionLabel: onResetFilters != null ? 'Reset Filters' : null,
          onAction: onResetFilters,
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: concepts.length,
      itemBuilder: (context, index) {
        final concept = concepts[index];
        final isBookmarked = bookmarkedIds.contains(concept.id);
        final isLearned = learnedIds.contains(concept.id);

        return ConceptCard(
          concept: concept,
          isBookmarked: isBookmarked,
          isLearned: isLearned,
          onTap: () => context.push(AppRoutes.concept(concept.id)),
          onBookmarkToggle: (_) => onBookmarkToggle(concept.id),
          onLearnedToggle: (_) => onLearnedToggle(concept.id),
        );
      },
    );
  }
}
