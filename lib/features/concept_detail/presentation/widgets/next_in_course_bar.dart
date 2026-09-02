import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../application/concept_detail_providers.dart';

/// Bottom action bar providing sequential navigation across a course and learned status toggle.
class NextInCourseBar extends StatelessWidget {
  const NextInCourseBar({
    super.key,
    required this.isLearned,
    required this.onLearnedToggle,
    this.navInfo = const CourseNavInfo(),
    this.courseId,
  });

  final bool isLearned;
  final VoidCallback onLearnedToggle;
  final CourseNavInfo navInfo;
  final String? courseId;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final inCourse = navInfo.course != null && courseId != null;

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        border: Border(
          top: BorderSide(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            width: 1,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onLearnedToggle,
                icon: Icon(
                  isLearned
                      ? Icons.check_circle_rounded
                      : Icons.check_circle_outline_rounded,
                  color: isLearned
                      ? AppColors.success
                      : (isDark
                          ? AppColors.darkTextSecondary
                          : AppColors.lightTextSecondary),
                  size: 18,
                ),
                label: Text(
                  isLearned ? 'Learned' : 'Mark as Learned',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: isLearned
                        ? AppColors.success
                        : (isDark
                            ? AppColors.darkTextPrimary
                            : AppColors.lightTextPrimary),
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  side: BorderSide(
                    color: isLearned
                        ? AppColors.success
                        : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ),
            if (inCourse && navInfo.hasNext) ...[
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    final nextId = navInfo.nextConceptId!;
                    context.pushReplacement(
                      AppRoutes.concept(nextId, courseId: courseId),
                    );
                  },
                  icon: const Icon(Icons.arrow_forward_rounded, size: 18),
                  label: const Text(
                    'Next Concept',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
