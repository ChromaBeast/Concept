enum Category {
  dsa('dsa', 'Data Structures & Algorithms'),
  systemDesign('system_design', 'System Design'),
  databases('databases', 'Databases'),
  operatingSystems('operating_systems', 'Operating Systems'),
  networking('networking', 'Networking'),
  oopDesignPatterns('oop_design_patterns', 'OOP & Design Patterns'),
  frontend('frontend', 'Frontend Development'),
  backend('backend', 'Backend Development'),
  devopsInfra('devops_infra', 'DevOps & Infrastructure'),
  security('security', 'Security'),
  testingQa('testing_qa', 'Testing & QA'),
  versionControl('version_control', 'Version Control & Git'),
  cloud('cloud', 'Cloud Computing'),
  mlBasics('ml_basics', 'Machine Learning Basics'),
  behavioralInterview('behavioral_interview', 'Behavioral Interview'),
  languageSpecific('language_specific', 'Language Specific');

  const Category(this.value, this.label);

  final String value;
  final String label;

  static Category fromValue(String? val, {Category fallback = Category.dsa}) {
    if (val == null || val.isEmpty) return fallback;
    final normalized = val.toLowerCase().replaceAll('-', '_').trim();
    for (final cat in Category.values) {
      if (cat.value == normalized || cat.name.toLowerCase() == normalized) {
        return cat;
      }
    }
    return fallback;
  }
}

enum Difficulty {
  beginner('beginner', 'Beginner'),
  intermediate('intermediate', 'Intermediate'),
  advanced('advanced', 'Advanced');

  const Difficulty(this.value, this.label);

  final String value;
  final String label;

  static Difficulty fromValue(
    String? val, {
    Difficulty fallback = Difficulty.beginner,
  }) {
    if (val == null || val.isEmpty) return fallback;
    final normalized = val.toLowerCase().trim();
    for (final diff in Difficulty.values) {
      if (diff.value == normalized || diff.name.toLowerCase() == normalized) {
        return diff;
      }
    }
    return fallback;
  }
}

enum ContentStatus {
  draft('draft'),
  needsReview('needs_review'),
  published('published'),
  flagged('flagged');

  const ContentStatus(this.value);

  final String value;

  static ContentStatus fromValue(
    String? val, {
    ContentStatus fallback = ContentStatus.draft,
  }) {
    if (val == null || val.isEmpty) return fallback;
    final normalized = val.toLowerCase().replaceAll('-', '_').trim();
    for (final s in ContentStatus.values) {
      if (s.value == normalized || s.name.toLowerCase() == normalized) {
        return s;
      }
    }
    return fallback;
  }
}

enum ContentSource {
  aiGenerated('ai_generated'),
  aiGeneratedReviewed('ai_generated_reviewed'),
  humanAuthored('human_authored'),
  aiCurated('ai_curated'),
  humanCurated('human_curated');

  const ContentSource(this.value);

  final String value;

  static ContentSource fromValue(
    String? val, {
    ContentSource fallback = ContentSource.aiGenerated,
  }) {
    if (val == null || val.isEmpty) return fallback;
    final normalized = val.toLowerCase().replaceAll('-', '_').trim();
    for (final src in ContentSource.values) {
      if (src.value == normalized || src.name.toLowerCase() == normalized) {
        return src;
      }
    }
    return fallback;
  }
}

enum RoadmapStatus {
  pending('pending'),
  claimed('claimed'),
  done('done'),
  failed('failed');

  const RoadmapStatus(this.value);

  final String value;

  static RoadmapStatus fromValue(
    String? val, {
    RoadmapStatus fallback = RoadmapStatus.pending,
  }) {
    if (val == null || val.isEmpty) return fallback;
    final normalized = val.toLowerCase().trim();
    for (final s in RoadmapStatus.values) {
      if (s.value == normalized || s.name.toLowerCase() == normalized) {
        return s;
      }
    }
    return fallback;
  }
}

enum RoadmapSource {
  seed('seed'),
  aiExpanded('ai_expanded');

  const RoadmapSource(this.value);

  final String value;

  static RoadmapSource fromValue(
    String? val, {
    RoadmapSource fallback = RoadmapSource.seed,
  }) {
    if (val == null || val.isEmpty) return fallback;
    final normalized = val.toLowerCase().replaceAll('-', '_').trim();
    for (final s in RoadmapSource.values) {
      if (s.value == normalized || s.name.toLowerCase() == normalized) {
        return s;
      }
    }
    return fallback;
  }
}
