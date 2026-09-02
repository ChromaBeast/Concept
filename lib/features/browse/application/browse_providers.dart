import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/utils/category_domains.dart';
import '../../../data/data.dart';

/// Currently selected domain cluster (defaults to all).
final selectedDomainProvider =
    StateProvider<CategoryDomain>((ref) => CategoryDomain.all);

/// Currently selected category filter (null = all categories).
final selectedCategoryProvider = StateProvider<Category?>((ref) => null);

/// Currently selected difficulty filter (null = all difficulties).
final selectedDifficultyProvider = StateProvider<Difficulty?>((ref) => null);

/// Currently selected tag filter (null = no tag filter).
final selectedTagIdProvider = StateProvider<String?>((ref) => null);

/// Concepts list filtered by active category/domain, difficulty, and tag filters.
final filteredConceptsProvider = FutureProvider<List<Concept>>((ref) async {
  final repo = ref.watch(conceptRepositoryProvider);
  final domain = ref.watch(selectedDomainProvider);
  final category = ref.watch(selectedCategoryProvider);
  final difficulty = ref.watch(selectedDifficultyProvider);
  final tagId = ref.watch(selectedTagIdProvider);

  final concepts = await repo.getConcepts(
    category: category,
    difficulty: difficulty,
    tagId: tagId,
  );

  if (category == null && domain != CategoryDomain.all) {
    return concepts.where((c) => domain.contains(c.category)).toList();
  }

  return concepts;
});

/// Map of category to count of published concepts.
final categoryConceptCountsProvider =
    FutureProvider<Map<Category, int>>((ref) async {
  final repo = ref.watch(conceptRepositoryProvider);
  final all = await repo.getConcepts();
  final counts = <Category, int>{};
  for (final c in all) {
    counts[c.category] = (counts[c.category] ?? 0) + 1;
  }
  return counts;
});
