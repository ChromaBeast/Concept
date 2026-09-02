import 'package:flutter_test/flutter_test.dart';
import 'package:concept/core/constants/app_constants.dart';
import 'package:concept/core/utils/read_time_formatter.dart';
import 'package:concept/core/utils/word_counter.dart';
import 'package:concept/data/models/concept_body.dart';

void main() {
  group('WordCounter & ReadTimeFormatter Tests', () {
    test('Word and line counting', () {
      expect(WordCounter.countWords(''), 0);
      expect(WordCounter.countWords(null), 0);
      expect(WordCounter.countWords('  hello   world  test  '), 3);
      expect(WordCounter.countLines('line1\nline2\nline3'), 3);
      expect(WordCounter.countLines(null), 0);
    });

    test('Read time calculation', () {
      final text = List.generate(140, (i) => 'word').join(' ');
      final seconds = WordCounter.calculateEstimatedReadSeconds(text);
      expect(seconds, 60); // 140 words at 140 wpm = 60s
    });

    test('Budget validation passes on standard content', () {
      const body = ConceptBody(
        definition: 'This is a brief definition under forty words.',
        whyItMatters: 'It matters because it optimizes distributed query performance.',
        example: 'SELECT * FROM users WHERE id = 1;',
        commonPitfall: 'Forgetting to add composite index.',
        interviewAngle: 'How does indexing affect write throughput?',
      );
      final validation = WordCounter.validateConceptBudget(body);
      expect(validation.isValid, isTrue);
      expect(validation.issues, isEmpty);
      expect(validation.totalWords, lessThan(AppConstants.targetTotalBodyWords));
    });

    test('Budget validation fails when word caps are exceeded', () {
      final longDefinition = List.generate(50, (i) => 'def').join(' ');
      final body = ConceptBody(
        definition: longDefinition,
        whyItMatters: 'Why it matters.',
        example: 'Example.',
      );
      final validation = WordCounter.validateConceptBudget(body);
      expect(validation.isValid, isFalse);
      expect(validation.issues.any((e) => e.contains('Definition exceeds')), isTrue);
    });

    test('ReadTimeFormatter formatting outputs', () {
      expect(ReadTimeFormatter.formatReadBadge(30), '~30 sec read');
      expect(ReadTimeFormatter.formatReadBadge(90), '~90 sec read');
      expect(ReadTimeFormatter.formatReadBadge(120), '~2 min read');
      expect(ReadTimeFormatter.formatReadBadge(0), '< 1 min read');

      expect(ReadTimeFormatter.formatShort(45), '45s');
      expect(ReadTimeFormatter.formatShort(120), '2m');

      expect(ReadTimeFormatter.formatCourseDuration(30), '< 1 min');
      expect(ReadTimeFormatter.formatCourseDuration(1200), '20 mins');
      expect(ReadTimeFormatter.formatCourseDuration(3600), '1 hr');
      expect(ReadTimeFormatter.formatCourseDuration(4500), '1 hr 15 mins');
    });
  });
}
