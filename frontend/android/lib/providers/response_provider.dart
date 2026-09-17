import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/response_model.dart';

class ResponseProvider extends ChangeNotifier {
  static const _storageKey = 'my_submissions';

  final List<ResponseModel> _responses = [];
  final Set<String> _submissionIds = {};

  bool _isLoading = false;
  String? _error;

  ResponseProvider() {
    _loadSubmissions();
  }

  List<ResponseModel> get responses => List.unmodifiable(_responses);
  bool get isLoading => _isLoading;
  String? get error => _error;

  List<ResponseModel> getResponsesByRespondent(String respondentId) =>
      _responses.where((r) => r.respondentId == respondentId).toList();

  ResponseModel? getResponse(String id) {
    for (final r in _responses) {
      if (r.id == id) return r;
    }
    return null;
  }

  Future<void> _loadSubmissions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final stored = prefs.getStringList(_storageKey) ?? [];

      for (final raw in stored) {
        try {
          final map = Map<String, dynamic>.from(jsonDecode(raw) as Map);
          final submission = ResponseModel.fromStoredJson(map);
          _responses.add(submission);
          _submissionIds.add(submission.id);
        } catch (_) {}
      }

      notifyListeners();
    } catch (_) {}
  }

  Future<void> _saveSubmissions() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final stored = _responses
          .where((r) => _submissionIds.contains(r.id))
          .map((r) => jsonEncode(r.toJson()))
          .toList();
      await prefs.setStringList(_storageKey, stored);
    } catch (_) {}
  }

  void recordSubmission({
    required String formId,
    required String respondentId,
    required String respondentEmail,
    required Map<String, dynamic> answers,
    String formTitle = '',
    String responseId = '',
    double? totalScore,
    DateTime? submittedAt,
    double maxScore = 0,
  }) {
    _responses.removeWhere(
      (r) => r.formId == formId && r.respondentId == respondentId,
    );

    _responses.add(
      ResponseModel.fromSubmission(
        formId: formId,
        respondentId: respondentId,
        respondentEmail: respondentEmail,
        answers: answers,
        formTitle: formTitle,
        responseId: responseId,
        totalScore: totalScore,
        submittedAt: submittedAt,
        maxScore: maxScore,
      ),
    );

    _submissionIds.add(
      responseId.isNotEmpty ? responseId : 'resp_$formId',
    );

    _saveSubmissions();
    notifyListeners();
  }
}
