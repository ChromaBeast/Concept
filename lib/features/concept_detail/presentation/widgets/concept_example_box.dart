import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/code_block_view.dart';

/// Box presenting the concrete code or architecture example for this concept.
class ConceptExampleBox extends StatelessWidget {
  const ConceptExampleBox({
    super.key,
    required this.example,
    this.language,
  });

  final String example;
  final String? language;

  String _inferLanguage(String code) {
    if (language != null && language!.isNotEmpty) return language!;
    final trimmed = code.trim();
    if (trimmed.startsWith('SELECT') ||
        trimmed.startsWith('CREATE') ||
        trimmed.startsWith('INSERT')) {
      return 'sql';
    }
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'json';
    }
    if (trimmed.contains('def ') || trimmed.contains('import ')) {
      return 'python';
    }
    if (trimmed.contains('func ') || trimmed.contains('package ')) {
      return 'go';
    }
    if (trimmed.contains('class ') ||
        trimmed.contains('void ') ||
        trimmed.contains('final ')) {
      return 'dart';
    }
    return 'dart';
  }

  @override
  Widget build(BuildContext context) {
    final inferredLang = _inferLanguage(example);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Row(
              children: [
                const Icon(
                  Icons.code_rounded,
                  size: 16,
                  color: AppColors.catDsa,
                ),
                const SizedBox(width: 8),
                const Text(
                  'CODE & IMPLEMENTATION',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                    color: AppColors.catDsa,
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.catDsa.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    inferredLang.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: AppColors.catDsa,
                    ),
                  ),
                ),
              ],
            ),
          ),
          CodeBlockView(
            code: example,
            language: inferredLang,
          ),
        ],
      ),
    );
  }
}
