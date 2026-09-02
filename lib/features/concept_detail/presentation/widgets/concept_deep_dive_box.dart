import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../data/models/deep_dive.dart';
import 'deep_dive_section_item.dart';

/// Reusable interactive collapsible Deep Dive section at the bottom of the Concept card.
class ConceptDeepDiveBox extends StatefulWidget {
  const ConceptDeepDiveBox({
    super.key,
    required this.deepDive,
  });

  final DeepDive deepDive;

  @override
  State<ConceptDeepDiveBox> createState() => _ConceptDeepDiveBoxState();
}

class _ConceptDeepDiveBoxState extends State<ConceptDeepDiveBox> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    if (widget.deepDive.sections.isEmpty) return const SizedBox.shrink();

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final readMinutes =
        (widget.deepDive.estimatedReadSeconds / 60).ceil().clamp(2, 10);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: isDark
              ? AppColors.darkCard.withValues(alpha: 0.8)
              : AppColors.lightCard.withValues(alpha: 0.8),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: _isExpanded
                ? AppColors.catSystemDesign.withValues(alpha: 0.4)
                : isDark
                    ? AppColors.darkBorder
                    : AppColors.lightBorder,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            InkWell(
              onTap: () => setState(() => _isExpanded = !_isExpanded),
              borderRadius: BorderRadius.circular(16),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: AppColors.catSystemDesign.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        Icons.layers_outlined,
                        size: 20,
                        color: AppColors.catSystemDesign,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Text(
                                'GO DEEPER',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 0.8,
                                  color: AppColors.catSystemDesign,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: isDark
                                      ? AppColors.darkBorder
                                      : AppColors.lightBorder,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  '~$readMinutes min read',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: isDark
                                        ? AppColors.darkTextSecondary
                                        : AppColors.lightTextSecondary,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text(
                            widget.deepDive.title ??
                                'In-Depth Architectural & Protocol Mechanics',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: isDark
                                  ? AppColors.darkTextPrimary
                                  : AppColors.lightTextPrimary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      _isExpanded
                          ? Icons.keyboard_arrow_up_rounded
                          : Icons.keyboard_arrow_down_rounded,
                      color: isDark
                          ? AppColors.darkTextSecondary
                          : AppColors.lightTextSecondary,
                    ),
                  ],
                ),
              ),
            ),
            if (_isExpanded)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Divider(
                      height: 1,
                      color: isDark
                          ? AppColors.darkBorder
                          : AppColors.lightBorder,
                    ),
                    const SizedBox(height: 14),
                    ...widget.deepDive.sections.map((section) {
                      return DeepDiveSectionItem(section: section);
                    }),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
