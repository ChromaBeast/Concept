import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/app_card.dart';

/// Box highlighting how this concept appears in technical interviews.
class ConceptInterviewBox extends StatelessWidget {
  const ConceptInterviewBox({
    super.key,
    required this.interviewAngle,
  });

  final String interviewAngle;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: AppCard(
        accentColor: AppColors.catBehavioralInterview,
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(
                  Icons.quiz_outlined,
                  size: 16,
                  color: AppColors.catBehavioralInterview,
                ),
                const SizedBox(width: 8),
                const Text(
                  'INTERVIEW ANGLE',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                    color: AppColors.catBehavioralInterview,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              interviewAngle,
              style: TextStyle(
                fontSize: 14.5,
                height: 1.5,
                color: isDark
                    ? AppColors.darkTextPrimary
                    : AppColors.lightTextPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
