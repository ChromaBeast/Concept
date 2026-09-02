import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/models.dart';
import '../../../../shared/widgets/concept_card.dart';

/// Displays a section of popular and trending concepts.
class TrendingConceptsRow extends StatelessWidget {
  const TrendingConceptsRow({
    super.key,
    required this.concepts,
    required this.bookmarkedIds,
    required this.learnedIds,
    required this.onBookmarkToggle,
    required this.onLearnedToggle,
  });

  final List<Concept> concepts;
  final Set<String> bookmarkedIds;
  final Set<String> learnedIds;
  final void Function(String conceptId) onBookmarkToggle;
  final void Function(String conceptId) onLearnedToggle;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Trending Concepts',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: isDark
                      ? AppColors.darkTextPrimary
                      : AppColors.lightTextPrimary,
                ),
              ),
              GestureDetector(
                onTap: () => context.go(AppRoutes.browse),
                child: const Text(
                  'See all',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primaryLight,
                  ),
                ),
              ),
            ],
          ),
        ),
        ListView.builder(
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
        ),
      ],
    );
  }
}
