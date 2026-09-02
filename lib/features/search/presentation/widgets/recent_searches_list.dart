import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// List displaying recent search queries with clear and tap actions.
class RecentSearchesList extends StatelessWidget {
  const RecentSearchesList({
    super.key,
    required this.recentSearches,
    required this.onSearchSelected,
    required this.onRemoveSearch,
    required this.onClearAll,
  });

  final List<String> recentSearches;
  final ValueChanged<String> onSearchSelected;
  final ValueChanged<String> onRemoveSearch;
  final VoidCallback onClearAll;

  @override
  Widget build(BuildContext context) {
    if (recentSearches.isEmpty) return const SizedBox.shrink();

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
                'Recent Searches',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: isDark
                      ? AppColors.darkTextPrimary
                      : AppColors.lightTextPrimary,
                ),
              ),
              GestureDetector(
                onTap: onClearAll,
                child: const Text(
                  'Clear all',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.error,
                  ),
                ),
              ),
            ],
          ),
        ),
        ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: recentSearches.length,
          itemBuilder: (context, index) {
            final query = recentSearches[index];
            return ListTile(
              dense: true,
              leading: Icon(
                Icons.history_rounded,
                size: 18,
                color: isDark
                    ? AppColors.darkTextTertiary
                    : AppColors.lightTextTertiary,
              ),
              title: Text(
                query,
                style: TextStyle(
                  fontSize: 13.5,
                  color: isDark
                      ? AppColors.darkTextPrimary
                      : AppColors.lightTextPrimary,
                ),
              ),
              trailing: IconButton(
                icon: const Icon(Icons.close_rounded, size: 16),
                color: isDark
                    ? AppColors.darkTextTertiary
                    : AppColors.lightTextTertiary,
                onPressed: () => onRemoveSearch(query),
              ),
              onTap: () => onSearchSelected(query),
            );
          },
        ),
      ],
    );
  }
}
