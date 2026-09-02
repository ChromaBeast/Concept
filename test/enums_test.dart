import 'package:flutter_test/flutter_test.dart';
import 'package:concept/data/models/enums.dart';

void main() {
  group('Category Enum Tests', () {
    test('Category values count and parsing', () {
      expect(Category.values.length, 16);
      expect(Category.fromValue('dsa'), Category.dsa);
      expect(Category.fromValue('system_design'), Category.systemDesign);
      expect(Category.fromValue('system-design'), Category.systemDesign);
      expect(Category.fromValue('systemDesign'), Category.systemDesign);
      expect(Category.fromValue('unknown_val'), Category.dsa);
    });

    test('Category labels and serialization values', () {
      expect(Category.dsa.value, 'dsa');
      expect(Category.systemDesign.value, 'system_design');
      expect(Category.databases.value, 'databases');
      expect(Category.operatingSystems.value, 'operating_systems');
      expect(Category.networking.value, 'networking');
      expect(Category.oopDesignPatterns.value, 'oop_design_patterns');
      expect(Category.frontend.value, 'frontend');
      expect(Category.backend.value, 'backend');
      expect(Category.devopsInfra.value, 'devops_infra');
      expect(Category.security.value, 'security');
      expect(Category.testingQa.value, 'testing_qa');
      expect(Category.versionControl.value, 'version_control');
      expect(Category.cloud.value, 'cloud');
      expect(Category.mlBasics.value, 'ml_basics');
      expect(Category.behavioralInterview.value, 'behavioral_interview');
      expect(Category.languageSpecific.value, 'language_specific');
    });
  });

  group('Difficulty Enum Tests', () {
    test('Difficulty values and parsing', () {
      expect(Difficulty.values.length, 3);
      expect(Difficulty.fromValue('beginner'), Difficulty.beginner);
      expect(Difficulty.fromValue('intermediate'), Difficulty.intermediate);
      expect(Difficulty.fromValue('advanced'), Difficulty.advanced);
      expect(Difficulty.fromValue('unknown'), Difficulty.beginner);
    });
  });

  group('ContentStatus Enum Tests', () {
    test('ContentStatus values and parsing', () {
      expect(ContentStatus.values.length, 4);
      expect(ContentStatus.fromValue('draft'), ContentStatus.draft);
      expect(ContentStatus.fromValue('needs_review'), ContentStatus.needsReview);
      expect(ContentStatus.fromValue('published'), ContentStatus.published);
      expect(ContentStatus.fromValue('flagged'), ContentStatus.flagged);
    });
  });

  group('ContentSource Enum Tests', () {
    test('ContentSource values and parsing', () {
      expect(ContentSource.values.length, 5);
      expect(ContentSource.fromValue('ai_generated'), ContentSource.aiGenerated);
      expect(ContentSource.fromValue('ai_generated_reviewed'), ContentSource.aiGeneratedReviewed);
      expect(ContentSource.fromValue('human_authored'), ContentSource.humanAuthored);
      expect(ContentSource.fromValue('ai_curated'), ContentSource.aiCurated);
      expect(ContentSource.fromValue('human_curated'), ContentSource.humanCurated);
    });
  });

  group('RoadmapStatus & RoadmapSource Enum Tests', () {
    test('RoadmapStatus values and parsing', () {
      expect(RoadmapStatus.values.length, 4);
      expect(RoadmapStatus.fromValue('pending'), RoadmapStatus.pending);
      expect(RoadmapStatus.fromValue('claimed'), RoadmapStatus.claimed);
      expect(RoadmapStatus.fromValue('done'), RoadmapStatus.done);
      expect(RoadmapStatus.fromValue('failed'), RoadmapStatus.failed);
    });

    test('RoadmapSource values and parsing', () {
      expect(RoadmapSource.values.length, 2);
      expect(RoadmapSource.fromValue('seed'), RoadmapSource.seed);
      expect(RoadmapSource.fromValue('ai_expanded'), RoadmapSource.aiExpanded);
    });
  });
}
