enum QuestionType {
  multipleChoice,
  checkbox,
  shortText,
  longText,
  rating,
  yesNo,
  imageChoice,
  mathFormula,
  codeInput,
  matching,
}

final RegExp _codeBlockPattern = RegExp(
  r'\[CODE\]\s*\n?([\s\S]*?)\s*\[\/CODE\]',
);
final RegExp _mathBlockPattern = RegExp(
  r'\[MATH\]\s*\n?([\s\S]*?)\s*\[\/MATH\]',
);

QuestionType questionTypeFromApi(String value) {
  switch (value) {
    case 'SHORT_TEXT':
      return QuestionType.shortText;
    case 'LONG_TEXT':
      return QuestionType.longText;
    case 'MULTIPLE_CHOICE':
    case 'DROPDOWN':
      return QuestionType.multipleChoice;
    case 'CHECKBOXES':
      return QuestionType.checkbox;
    case 'RATING':
      return QuestionType.rating;
    case 'YES_NO':
      return QuestionType.yesNo;
    case 'MATH':
      return QuestionType.mathFormula;
    case 'CODE':
      return QuestionType.codeInput;
    case 'IMAGE':
      return QuestionType.imageChoice;
    case 'MATCHING':
      return QuestionType.matching;
    default:
      return QuestionType.shortText;
  }
}

class MatchingPair {
  final String id;
  final String left;
  final String right;

  const MatchingPair({
    required this.id,
    required this.left,
    required this.right,
  });

  factory MatchingPair.fromJson(Map<String, dynamic> json) {
    return MatchingPair(
      id: (json['id'] ?? '').toString(),
      left: (json['option_text'] ?? '').toString(),
      right: (json['match_text'] ?? '').toString(),
    );
  }
}

class QuestionModel {
  final String id;
  final QuestionType type;
  final String text;
  final String? imageUrl;
  final String? audioUrl;
  final String? mathFormula;
  final String? codeSnippet;
  final List<OptionModel> options;
  final bool isRequired;
  final int? ratingMax;
  final bool hasScore;
  final double score;
  final List<MatchingPair> matchingPairs;

  const QuestionModel({
    required this.id,
    required this.type,
    required this.text,
    this.imageUrl,
    this.audioUrl,
    this.mathFormula,
    this.codeSnippet,
    this.options = const [],
    this.isRequired = true,
    this.ratingMax,
    this.hasScore = false,
    this.score = 0,
    this.matchingPairs = const [],
  });

  QuestionModel copyWith({
    List<OptionModel>? options,
    List<MatchingPair>? matchingPairs,
  }) {
    return QuestionModel(
      id: id,
      type: type,
      text: text,
      imageUrl: imageUrl,
      audioUrl: audioUrl,
      mathFormula: mathFormula,
      codeSnippet: codeSnippet,
      options: options ?? this.options,
      isRequired: isRequired,
      ratingMax: ratingMax,
      hasScore: hasScore,
      score: score,
      matchingPairs: matchingPairs ?? this.matchingPairs,
    );
  }

  factory QuestionModel.fromJson(Map<String, dynamic> json) {
    final questionId = (json['id'] ?? '').toString();
    final imageUrl = (json['img_url'] ?? '').toString();
    final audioUrl = (json['audio_url'] ?? '').toString();
    final codeLanguage = (json['code_language'] ?? '').toString();

    final mappedType =
        questionTypeFromApi((json['question_type'] ?? '').toString());

    String? snippet;
    if (mappedType == QuestionType.codeInput && codeLanguage.isNotEmpty) {
      snippet = codeLanguage;
    }

    var rawText = (json['question_text'] ?? '').toString();

    final codeMatch = _codeBlockPattern.firstMatch(rawText);
    if (codeMatch != null) {
      final payload = codeMatch.group(1)?.trim() ?? '';
      if (payload.isNotEmpty) snippet = payload;
      rawText = rawText.replaceRange(codeMatch.start, codeMatch.end, '');
    }

    String? mathFormula;
    final mathMatch = _mathBlockPattern.firstMatch(rawText);
    if (mathMatch != null) {
      final payload = mathMatch.group(1)?.trim() ?? '';
      if (payload.isNotEmpty) mathFormula = payload;
      rawText = rawText.replaceRange(mathMatch.start, mathMatch.end, '');
    }

    rawText = rawText.trim();

    final List<OptionModel> options = [];
    final List<MatchingPair> matchingPairs = [];
    if (json['options'] is List) {
      if (mappedType == QuestionType.matching) {
        matchingPairs.addAll((json['options'] as List)
            .whereType<Map>()
            .map((e) => MatchingPair.fromJson({...e})));
      } else {
        options.addAll((json['options'] as List)
            .whereType<Map>()
            .map((e) => OptionModel.fromJson({...e})));
      }
    }

    return QuestionModel(
      id: questionId,
      type: mappedType,
      text: rawText,
      imageUrl: imageUrl.isEmpty ? null : imageUrl,
      audioUrl: audioUrl.isEmpty ? null : audioUrl,
      codeSnippet: snippet,
      mathFormula: mappedType == QuestionType.mathFormula ? mathFormula : null,
      isRequired: json['is_required'] == true,
      ratingMax: mappedType == QuestionType.rating ? 5 : null,
      hasScore: json['points'] is num && (json['points'] as num) > 0,
      score: (json['points'] is num) ? (json['points'] as num).toDouble() : 0,
      options: options,
      matchingPairs: matchingPairs,
    );
  }
}

class OptionModel {
  final String id;
  final String text;
  final String? content;
  final String? imageUrl;
  final double score;
  final bool isCorrect;

  const OptionModel({
    required this.id,
    required this.text,
    this.content,
    this.imageUrl,
    this.score = 0,
    this.isCorrect = false,
  });

  OptionModel copyWith({
    String? text,
    String? content,
    String? imageUrl,
    double? score,
    bool? isCorrect,
  }) {
    return OptionModel(
      id: id,
      text: text ?? this.text,
      content: content ?? this.content,
      imageUrl: imageUrl ?? this.imageUrl,
      score: score ?? this.score,
      isCorrect: isCorrect ?? this.isCorrect,
    );
  }

  factory OptionModel.fromJson(Map<String, dynamic> json) {
    final imageUrl = (json['img_url'] ?? '').toString();
    final isCorrect = json['is_correct'] == true;
    final content = json['option_content']?.toString();

    return OptionModel(
      id: (json['id'] ?? '').toString(),
      text: (json['option_text'] ?? '').toString(),
      content: (content != null && content.isNotEmpty) ? content : null,
      imageUrl: imageUrl.isEmpty ? null : imageUrl,
      score: isCorrect ? 1 : 0,
      isCorrect: isCorrect,
    );
  }
}
