import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/data.dart';

/// Learning progress statistics per Category.
class CategoryStat {
  const CategoryStat({
    required this.category,
    required this.totalCount,
    required this.learnedCount,
  });

  final Category category;
  final int totalCount;
  final int learnedCount;

  double get progress => totalCount > 0 ? (learnedCount / totalCount).clamp(0.0, 1.0) : 0.0;
}

/// Computes category mastery statistics for the current user.
final categoryLearningStatsProvider =
    FutureProvider<List<CategoryStat>>((ref) async {
  final conceptRepo = ref.watch(conceptRepositoryProvider);
  final profileAsync = ref.watch(userProfileNotifierProvider);

  final userProfile = profileAsync.asData?.value;
  final learnedIds = userProfile?.learnedConceptIds.toSet() ?? const <String>{};

  final allConcepts = await conceptRepo.getConcepts();
  final statsMap = <Category, (int total, int learned)>{};

  for (final c in allConcepts) {
    final current = statsMap[c.category] ?? (0, 0);
    final isLearned = learnedIds.contains(c.id);
    statsMap[c.category] = (
      current.$1 + 1,
      current.$2 + (isLearned ? 1 : 0),
    );
  }

  return Category.values.map((cat) {
    final pair = statsMap[cat] ?? (0, 0);
    return CategoryStat(
      category: cat,
      totalCount: pair.$1,
      learnedCount: pair.$2,
    );
  }).toList();
});
