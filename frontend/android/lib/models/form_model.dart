import 'question_model.dart';

enum ResultVisibility {
  hidden,
  resultOnly,
  resultAndScore,
}

class FormModel {
  final String id;
  final String title;
  final String creatorId;
  final String shortLink;
  final String customLinkAlias;
  final DateTime scheduledOpen;
  final DateTime scheduledClose;
  final int timerMinutes;
  final bool isPublic;
  final bool shuffleQuestions;
  final bool shuffleOptions;
  final bool oneTimeOnly;
  final bool isActive;
  final ResultVisibility resultVisibility;
  final String accessToken;
  final bool requiresToken;
  final List<QuestionModel> questions;
  final int totalResponses;
  final DateTime createdAt;

  FormModel({
    required this.id,
    required this.title,
    required this.creatorId,
    this.shortLink = '',
    this.customLinkAlias = '',
    required this.scheduledOpen,
    required this.scheduledClose,
    this.timerMinutes = 0,
    this.isPublic = true,
    this.shuffleQuestions = false,
    this.shuffleOptions = false,
    this.oneTimeOnly = true,
    this.isActive = true,
    this.resultVisibility = ResultVisibility.hidden,
    this.accessToken = '',
    this.requiresToken = false,
    List<QuestionModel>? questions,
    this.totalResponses = 0,
    required this.createdAt,
  }) : questions = questions ?? [];

  bool get hasAccessToken =>
      accessToken.trim().isNotEmpty || requiresToken;

  String get fullLink => customLinkAlias.isNotEmpty
      ? 'hidocs.app/f/$customLinkAlias'
      : 'hidocs.app/f/$shortLink';

  String get slug => customLinkAlias.isNotEmpty ? customLinkAlias : shortLink;

  double get maxScore {
    var total = 0.0;
    for (final q in questions) {
      if (q.hasScore || q.score > 0) {
        total += q.score;
      }
    }
    return total;
  }

  bool get isScheduled => scheduledOpen != scheduledClose;
  bool get hasTimer => timerMinutes > 0;

  factory FormModel.fromJson(Map<String, dynamic> json) {
    final settings = json['form_settings'] is Map
        ? Map<String, dynamic>.from(json['form_settings'] as Map)
        : <String, dynamic>{};

    final startTime =
        DateTime.tryParse(settings['start_time']?.toString() ?? '')?.toLocal();
    final endTime =
        DateTime.tryParse(settings['end_time']?.toString() ?? '')?.toLocal();
    final now = DateTime.now();

    final status = (json['status'] ?? '').toString();
    final accessMode =
        (json['access_mode'] ?? settings['access_mode'] ?? 'public').toString();
    final accessToken =
        (settings['access_token'] ?? json['access_token'] ?? '').toString();

    return FormModel(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      creatorId: (json['user_id'] ?? '').toString(),
      shortLink: (json['custom_url'] ?? '').toString(),
      customLinkAlias: (json['custom_url'] ?? '').toString(),
      scheduledOpen: startTime ?? now,
      scheduledClose: endTime ?? now,
      timerMinutes: settings['duration_minutes'] is num
          ? ((settings['duration_minutes'] as num).toInt()).clamp(0, 100000)
          : 0,
      isPublic: accessMode == 'public',
      shuffleQuestions: settings['randomize_questions'] == true,
      shuffleOptions: settings['randomize_options'] == true,
      oneTimeOnly: settings['is_one_time_submission'] == true,
      isActive: status == 'ACTIVE',
      accessToken: accessToken,
      requiresToken: settings['requires_token'] == true,
      questions: json['questions'] is List
          ? (json['questions'] as List)
              .whereType<Map>()
              .map((e) => QuestionModel.fromJson({...e}))
              .toList()
          : <QuestionModel>[],
      totalResponses: (json['response_count'] is num)
          ? (json['response_count'] as num).toInt()
          : 0,
      createdAt:
          DateTime.tryParse(json['created_at']?.toString() ?? '')?.toLocal() ??
              DateTime.now(),
    );
  }
}
