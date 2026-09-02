import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/category_domains.dart';

/// Horizontal domain cluster filter bar (Core CS, Systems & Cloud, Web, Career).
class DomainClusterFilter extends StatelessWidget {
  const DomainClusterFilter({
    super.key,
    required this.selectedDomain,
    required this.onDomainSelected,
  });

  final CategoryDomain selectedDomain;
  final ValueChanged<CategoryDomain> onDomainSelected;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Row(
        children: CategoryDomain.values.map((domain) {
          final isSelected = domain == selectedDomain;

          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              onTap: () {
                HapticFeedback.selectionClick();
                onDomainSelected(domain);
              },
              borderRadius: BorderRadius.circular(20),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 180),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 7,
                ),
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppColors.primaryLight.withValues(alpha: 0.18)
                      : isDark
                          ? AppColors.darkSurface
                          : AppColors.lightSurface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isSelected
                        ? AppColors.primaryLight
                        : isDark
                            ? AppColors.darkBorder
                            : AppColors.lightBorder,
                    width: isSelected ? 1.2 : 0.8,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      domain.icon,
                      size: 15,
                      color: isSelected
                          ? AppColors.primaryLight
                          : isDark
                              ? AppColors.darkTextSecondary
                              : AppColors.lightTextSecondary,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      domain.label,
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight:
                            isSelected ? FontWeight.w700 : FontWeight.w500,
                        color: isSelected
                            ? AppColors.primaryLight
                            : isDark
                                ? AppColors.darkTextPrimary
                                : AppColors.lightTextPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}
