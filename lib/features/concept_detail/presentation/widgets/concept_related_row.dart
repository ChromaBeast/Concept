import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/concept.dart';
import '../../../../shared/widgets/concept_card.dart';

/// Section showing related concepts to explore further.
class ConceptRelatedRow extends StatelessWidget {
  const ConceptRelatedRow({
    super.key,
    required this.relatedConcepts,
  });

  final List<Concept> relatedConcepts;

  @override
  Widget build(BuildContext context) {
    if (relatedConcepts.isEmpty) return const SizedBox.shrink();

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 16, 8),
          child: Row(
            children: [
              const Icon(
                Icons.hub_outlined,
                size: 16,
                color: AppColors.primaryLight,
              ),
              const SizedBox(width: 8),
              Text(
                'RELATED CONCEPTS',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.8,
                  color: isDark
                      ? AppColors.darkTextSecondary
                      : AppColors.lightTextSecondary,
                ),
              ),
            ],
          ),
        ),
        ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: relatedConcepts.length,
          itemBuilder: (context, index) {
            final concept = relatedConcepts[index];
            return ConceptCard(
              concept: concept,
              showBookmark: false,
              showLearnedStatus: false,
              onTap: () => context.push(AppRoutes.concept(concept.id)),
            );
          },
        ),
      ],
    );
  }
}
