import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../../core/theme/app_colors.dart';

/// Base shimmer placeholder container with rounded corners.
class ShimmerBox extends StatelessWidget {
  const ShimmerBox({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius = 6.0,
  });

  final double width;
  final double height;
  final double borderRadius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(borderRadius),
      ),
    );
  }
}

/// Shimmer skeleton loading card for a concept item.
class ConceptCardSkeleton extends StatelessWidget {
  const ConceptCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final baseColor = isDark ? AppColors.darkSurfaceVariant : AppColors.lightSurfaceVariant;
    final highlightColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      child: Shimmer.fromColors(
        baseColor: baseColor,
        highlightColor: highlightColor,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                ShimmerBox(width: 90, height: 20, borderRadius: 10),
                ShimmerBox(width: 50, height: 18, borderRadius: 9),
              ],
            ),
            const SizedBox(height: 12),
            const ShimmerBox(width: double.infinity, height: 16),
            const SizedBox(height: 6),
            const ShimmerBox(width: 180, height: 16),
            const SizedBox(height: 10),
            const ShimmerBox(width: double.infinity, height: 12),
            const SizedBox(height: 4),
            const ShimmerBox(width: 220, height: 12),
            const SizedBox(height: 14),
            Row(
              children: const [
                ShimmerBox(width: 70, height: 16),
                SizedBox(width: 12),
                ShimmerBox(width: 60, height: 16),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// Shimmer skeleton loading card for a course item.
class CourseCardSkeleton extends StatelessWidget {
  const CourseCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final baseColor = isDark ? AppColors.darkSurfaceVariant : AppColors.lightSurfaceVariant;
    final highlightColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : AppColors.lightCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      child: Shimmer.fromColors(
        baseColor: baseColor,
        highlightColor: highlightColor,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: const [
                ShimmerBox(width: 80, height: 20, borderRadius: 10),
                SizedBox(width: 8),
                ShimmerBox(width: 60, height: 18, borderRadius: 9),
              ],
            ),
            const SizedBox(height: 12),
            const ShimmerBox(width: 220, height: 18),
            const SizedBox(height: 8),
            const ShimmerBox(width: double.infinity, height: 13),
            const SizedBox(height: 4),
            const ShimmerBox(width: 160, height: 13),
            const SizedBox(height: 16),
            const ShimmerBox(width: double.infinity, height: 6, borderRadius: 3),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                ShimmerBox(width: 80, height: 14),
                ShimmerBox(width: 70, height: 14),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// Shimmer skeleton loading list for concept cards.
class ConceptListSkeleton extends StatelessWidget {
  const ConceptListSkeleton({
    super.key,
    this.itemCount = 4,
    this.padding = const EdgeInsets.all(16),
  });

  final int itemCount;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      padding: padding,
      itemCount: itemCount,
      itemBuilder: (context, index) => const ConceptCardSkeleton(),
    );
  }
}
