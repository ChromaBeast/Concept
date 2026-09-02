import 'package:flutter/material.dart';
import '../../../../core/utils/category_utils.dart';
import '../../../../data/models/enums.dart';

/// Header banner displaying the currently active category filter with clear action.
class SelectedCategoryHeader extends StatelessWidget {
  const SelectedCategoryHeader({
    super.key,
    required this.category,
    required this.onDeselect,
  });

  final Category category;
  final VoidCallback onDeselect;

  @override
  Widget build(BuildContext context) {
    final color = CategoryUtils.getAccentColor(category);
    final icon = CategoryUtils.getIcon(category);

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 4, 16, 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.35)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              category.label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          ),
          IconButton(
            visualDensity: VisualDensity.compact,
            icon: const Icon(Icons.close_rounded, size: 18),
            color: color,
            onPressed: onDeselect,
          ),
        ],
      ),
    );
  }
}
