import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/category_utils.dart';
import '../../../../data/models/concept.dart';

/// Hero visual diagram or conceptual illustration displayed between Why It Matters and Example.
class ConceptHeroImage extends StatelessWidget {
  const ConceptHeroImage({
    super.key,
    required this.concept,
  });

  final Concept concept;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final accent = CategoryUtils.getAccentColor(concept.category);
    final hasUrl =
        concept.heroImageUrl != null && concept.heroImageUrl!.isNotEmpty;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: Container(
          width: double.infinity,
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkCard : AppColors.lightCard,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: accent.withValues(alpha: isDark ? 0.35 : 0.2),
            ),
          ),
          child: hasUrl
              ? CachedNetworkImage(
                  imageUrl: concept.heroImageUrl!,
                  height: 180,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    height: 180,
                    color: accent.withValues(alpha: 0.1),
                    child: Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(accent),
                        strokeWidth: 2,
                      ),
                    ),
                  ),
                  errorWidget: (context, url, error) => _PlaceholderBanner(
                    concept: concept,
                    accent: accent,
                    isDark: isDark,
                  ),
                )
              : _PlaceholderBanner(
                  concept: concept,
                  accent: accent,
                  isDark: isDark,
                ),
        ),
      ),
    );
  }
}

class _PlaceholderBanner extends StatelessWidget {
  const _PlaceholderBanner({
    required this.concept,
    required this.accent,
    required this.isDark,
  });

  final Concept concept;
  final Color accent;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    final icon = CategoryUtils.getIcon(concept.category);

    return Container(
      height: 140,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            accent.withValues(alpha: isDark ? 0.18 : 0.1),
            accent.withValues(alpha: isDark ? 0.05 : 0.02),
          ],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -10,
            bottom: -15,
            child: Icon(
              icon,
              size: 110,
              color: accent.withValues(alpha: isDark ? 0.15 : 0.08),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Row(
                children: [
                  Icon(Icons.schema_rounded, size: 16, color: accent),
                  const SizedBox(width: 6),
                  Text(
                    'CONCEPT ARCHITECTURE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: accent,
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                concept.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: isDark
                      ? AppColors.darkTextPrimary
                      : AppColors.lightTextPrimary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${concept.category.label} • ${concept.difficulty.label}',
                style: TextStyle(
                  fontSize: 12,
                  color: isDark
                      ? AppColors.darkTextSecondary
                      : AppColors.lightTextSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
