import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'models/models.dart';
import 'repositories/repositories.dart';
import 'services/services.dart';

/// Global singleton instance of [CacheService].
final globalCacheService = CacheService();

/// Global singleton instance of [SeedDataService].
const globalSeedDataService = SeedDataService();

/// Provider for [CacheService].
final cacheServiceProvider = Provider<CacheService>((ref) {
  return globalCacheService;
});

/// Provider for [UserRepository].
final userRepositoryProvider = Provider<UserRepository>((ref) {
  final cache = ref.watch(cacheServiceProvider);
  return UserRepository(cacheService: cache);
});

/// Provider for [ConceptRepository].
final conceptRepositoryProvider = Provider<ConceptRepository>((ref) {
  final cache = ref.watch(cacheServiceProvider);
  final userRepo = ref.watch(userRepositoryProvider);
  return ConceptRepository(cacheService: cache, userRepository: userRepo);
});

/// Provider for [CourseRepository].
final courseRepositoryProvider = Provider<CourseRepository>((ref) {
  final cache = ref.watch(cacheServiceProvider);
  final userRepo = ref.watch(userRepositoryProvider);
  return CourseRepository(cacheService: cache, userRepository: userRepo);
});

/// Provider for [TagRepository].
final tagRepositoryProvider = Provider<TagRepository>((ref) {
  final cache = ref.watch(cacheServiceProvider);
  return TagRepository(cacheService: cache);
});

/// Provider for [SearchRepository].
final searchRepositoryProvider = Provider<SearchRepository>((ref) {
  final cache = ref.watch(cacheServiceProvider);
  return SearchRepository(cacheService: cache);
});

/// Provider for [AdminRepository].
final adminRepositoryProvider = Provider<AdminRepository>((ref) {
  final cache = ref.watch(cacheServiceProvider);
  return AdminRepository(cacheService: cache);
});

/// Provider for the current user ID.
final currentUserIdProvider = StateProvider<String>((ref) => 'default_user');

/// Notifier managing current user's profile and quick actions.
class UserProfileNotifier extends StateNotifier<AsyncValue<UserProfile>> {
  UserProfileNotifier(this._userRepository, this._userId)
      : super(const AsyncValue.loading()) {
    loadProfile();
  }

  final UserRepository _userRepository;
  final String _userId;

  Future<void> loadProfile() async {
    try {
      final profile = await _userRepository.getUserProfile(_userId);
      state = AsyncValue.data(profile);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<bool> toggleBookmark(String conceptId) async {
    final isBookmarked = await _userRepository.toggleBookmark(_userId, conceptId);
    await loadProfile();
    return isBookmarked;
  }

  Future<bool> toggleLearned(String conceptId) async {
    final isLearned = await _userRepository.toggleLearned(_userId, conceptId);
    await loadProfile();
    return isLearned;
  }

  Future<void> updateThemeMode(String themeMode) async {
    await _userRepository.updateThemeMode(_userId, themeMode);
    await loadProfile();
  }

  Future<void> recordStreak() async {
    final updated = await _userRepository.recordDailyStreak(_userId);
    state = AsyncValue.data(updated);
  }
}

/// Provider for [UserProfileNotifier].
final userProfileNotifierProvider =
    StateNotifierProvider<UserProfileNotifier, AsyncValue<UserProfile>>((ref) {
  final userRepo = ref.watch(userRepositoryProvider);
  final userId = ref.watch(currentUserIdProvider);
  return UserProfileNotifier(userRepo, userId);
});
