import 'dart:convert';

class QuickCheck {
  const QuickCheck({
    required this.question,
    required this.answer,
  });

  final String question;
  final String answer;

  QuickCheck copyWith({
    String? question,
    String? answer,
  }) {
    return QuickCheck(
      question: question ?? this.question,
      answer: answer ?? this.answer,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'question': question,
      'answer': answer,
    };
  }

  factory QuickCheck.fromMap(Map<String, dynamic> map) {
    return QuickCheck(
      question: map['question'] as String? ?? '',
      answer: map['answer'] as String? ?? '',
    );
  }

  String toJson() => json.encode(toMap());

  factory QuickCheck.fromJson(String source) =>
      QuickCheck.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() => 'QuickCheck(question: $question, answer: $answer)';

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is QuickCheck &&
        other.question == question &&
        other.answer == answer;
  }

  @override
  int get hashCode => question.hashCode ^ answer.hashCode;
}
