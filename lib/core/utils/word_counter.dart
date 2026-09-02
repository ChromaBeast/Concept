import '../constants/app_constants.dart';
import '../../data/models/concept_body.dart';

class WordBudgetValidation {
  const WordBudgetValidation({
    required this.isValid,
    required this.totalWords,
    required this.issues,
  });

  final bool isValid;
  final int totalWords;
  final List<String> issues;
}

class WordCounter {
  const WordCounter._();

  static final RegExp _wordSplitRegex = RegExp(r'\s+');

  static int countWords(String? text) {
    if (text == null) return 0;
    final trimmed = text.trim();
    if (trimmed.isEmpty) return 0;
    return trimmed.split(_wordSplitRegex).length;
  }

  static int countLines(String? text) {
    if (text == null) return 0;
    final trimmed = text.trim();
    if (trimmed.isEmpty) return 0;
    return trimmed.split('\n').length;
  }

  static int calculateEstimatedReadSeconds(
    String text, {
    int wpm = AppConstants.readingWordsPerMinute,
  }) {
    final words = countWords(text);
    if (words == 0) return AppConstants.minReadSeconds;
    final seconds = ((words / wpm) * 60).round();
    return seconds.clamp(
      AppConstants.minReadSeconds,
      AppConstants.maxReadSeconds,
    );
  }

  static int calculateConceptReadSeconds(ConceptBody body) {
    final totalWords = countWords(body.definition) +
        countWords(body.whyItMatters) +
        countWords(body.example) +
        countWords(body.commonPitfall) +
        countWords(body.interviewAngle);

    final seconds = ((totalWords / AppConstants.readingWordsPerMinute) * 60).round();
    return seconds.clamp(
      AppConstants.minReadSeconds,
      AppConstants.maxReadSeconds,
    );
  }

  static WordBudgetValidation validateConceptBudget(ConceptBody body) {
    final issues = <String>[];

    final defWords = countWords(body.definition);
    if (defWords > AppConstants.maxDefinitionWords) {
      issues.add(
        'Definition exceeds ${AppConstants.maxDefinitionWords} words (got $defWords)',
      );
    }

    final whyWords = countWords(body.whyItMatters);
    if (whyWords > AppConstants.maxWhyItMattersWords) {
      issues.add(
        'WhyItMatters exceeds ${AppConstants.maxWhyItMattersWords} words (got $whyWords)',
      );
    }

    final exampleWords = countWords(body.example);
    final exampleLines = countLines(body.example);
    if (exampleWords > AppConstants.maxExampleWords &&
        exampleLines > AppConstants.maxExampleLines) {
      issues.add(
        'Example exceeds both ${AppConstants.maxExampleWords} words ($exampleWords) and ${AppConstants.maxExampleLines} lines ($exampleLines)',
      );
    }

    final pitfallWords = countWords(body.commonPitfall);
    if (pitfallWords > AppConstants.maxCommonPitfallWords) {
      issues.add(
        'CommonPitfall exceeds ${AppConstants.maxCommonPitfallWords} words (got $pitfallWords)',
      );
    }

    final interviewWords = countWords(body.interviewAngle);
    if (interviewWords > AppConstants.maxInterviewAngleWords) {
      issues.add(
        'InterviewAngle exceeds ${AppConstants.maxInterviewAngleWords} words (got $interviewWords)',
      );
    }

    final totalWords = defWords + whyWords + exampleWords + pitfallWords + interviewWords;
    if (totalWords > AppConstants.absoluteMaxTotalBodyWords) {
      issues.add(
        'Total body exceeds ${AppConstants.absoluteMaxTotalBodyWords} absolute max words (got $totalWords)',
      );
    }

    return WordBudgetValidation(
      isValid: issues.isEmpty,
      totalWords: totalWords,
      issues: issues,
    );
  }
}
