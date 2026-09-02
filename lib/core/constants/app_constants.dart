class AppConstants {
  const AppConstants._();

  // App Meta
  static const String appName = 'Concepts';
  static const String appTagline =
      'Real-world software engineering concepts, explained in under 2 minutes.';

  // Word & Line Caps (Spec §2.4)
  static const int maxDefinitionWords = 40;
  static const int maxWhyItMattersWords = 60;
  static const int maxExampleWords = 60;
  static const int maxExampleLines = 12;
  static const int maxCommonPitfallWords = 40;
  static const int maxInterviewAngleWords = 30;
  static const int targetTotalBodyWords = 230;
  static const int absoluteMaxTotalBodyWords = 260;

  // Reading Speed & Time (Spec §2.4, §5.2)
  static const int readingWordsPerMinute = 140; // Dense technical reading speed (130-160 wpm)
  static const int minReadSeconds = 30;
  static const int maxReadSeconds = 240;
  static const int defaultReadSeconds = 90;

  // Search & Interaction
  static const Duration searchDebounceDuration = Duration(milliseconds: 300);
  static const int maxRecentSearches = 10;
  static const int maxFuzzyLevenshteinDistance = 2;

  // Pipeline & Backend
  static const int pipelineBatchSize = 15;
  static const int pipelineBoundedConcurrency = 4;
  static const int maxGenerationRetries = 2;
  static const String defaultAiModel = 'gemini-3.7-flash';
  static const String defaultValidatorModel = 'gemini-3.5-flash-lite';
  static const String defaultPromptVersion = 'v1';

  // Courses (Spec §4.7)
  static const int minCourseConcepts = 6;
  static const int maxCourseConcepts = 20;
  static const double courseDedupeThreshold = 0.70;

  // UI & Animations
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 350);
  static const double cardBorderRadius = 14.0;
  static const double chipBorderRadius = 20.0;
}
