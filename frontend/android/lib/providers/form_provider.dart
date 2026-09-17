import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/form_model.dart';
import '../services/api_client.dart';

class FormProvider extends ChangeNotifier {
  final List<FormModel> _forms = [];
  final Set<String> _submittedForms = {};
  bool _isLoading = false;
  String? _error;

  List<FormModel> get forms => List.unmodifiable(_forms);
  bool get isLoading => _isLoading;
  String? get error => _error;

  FormProvider() {
    _loadSubmitted();
  }

  Future<void> _loadSubmitted() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final ids = prefs.getStringList('submitted_forms') ?? [];
      _submittedForms.addAll(ids);
      notifyListeners();
    } catch (_) {}
  }

  Future<void> _saveSubmitted() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList('submitted_forms', _submittedForms.toList());
    } catch (_) {}
  }

  bool hasSubmitted(String formId) => _submittedForms.contains(formId);

  void markSubmitted(String formId) {
    _submittedForms.add(formId);
    _saveSubmitted();
    notifyListeners();
  }

  Future<FormModel?> loadFormDetail(String formId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await ApiClient.get('/forms/$formId');

      if (data is Map) {
        final detail = FormModel.fromJson(Map<String, dynamic>.from(data));

        final index = _forms.indexWhere((f) => f.id == detail.id);
        if (index >= 0) {
          _forms[index] = detail;
        } else {
          _forms.add(detail);
        }

        _isLoading = false;
        notifyListeners();

        return detail;
      }

      _isLoading = false;
    } on ApiException catch (e) {
      _error = e.message;
      _isLoading = false;
    } catch (_) {
      _error = 'Koneksi gagal. Periksa jaringan atau server.';
      _isLoading = false;
    }

    notifyListeners();
    return null;
  }

  Future<FormModel?> loadPublicForm(String code) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await ApiClient.get(
        '/public/forms/${Uri.encodeComponent(code)}',
      );

      if (data is Map) {
        final form = FormModel.fromJson(Map<String, dynamic>.from(data));

        final index = _forms.indexWhere((f) => f.id == form.id);
        if (index >= 0) {
          _forms[index] = form;
        } else {
          _forms.add(form);
        }

        _isLoading = false;
        notifyListeners();

        return form;
      }

      _isLoading = false;
    } on ApiException catch (e) {
      _error = e.message;
      _isLoading = false;
    } catch (_) {
      _error = 'Koneksi gagal. Periksa jaringan atau server.';
      _isLoading = false;
    }

    notifyListeners();
    return null;
  }

  FormModel? getFormById(String formId) {
    final index = _forms.indexWhere((f) => f.id == formId);
    return index >= 0 ? _forms[index] : null;
  }

  Future<bool> verifyFormToken(String shortCode, String token) async {
    try {
      final data = await ApiClient.post(
        '/public/forms/${Uri.encodeComponent(shortCode)}/verify-token',
        body: {'token': token},
      );
      return data is Map && data['valid'] == true;
    } catch (_) {
      return false;
    }
  }

  Future<Map<String, dynamic>?> submitForm(
    String formId, {
    required String respondentEmail,
    required List<Map<String, dynamic>> answers,
    bool auto = false,
    String token = '',
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await ApiClient.post('/forms/$formId/submit', body: {
        'respondent_email': respondentEmail,
        'passcode': '',
        'token': token,
        'is_auto_submitted': auto,
        'answers': answers,
      });

      markSubmitted(formId);

      _isLoading = false;
      notifyListeners();

      if (data is Map) {
        return Map<String, dynamic>.from(data);
      }

      return null;
    } on ApiException catch (e) {
      _error = e.message;
    } catch (_) {
      _error = 'Koneksi gagal. Periksa jaringan atau server.';
    }

    _isLoading = false;
    notifyListeners();

    return null;
  }

  void clearError() {
    _error = null;
  }
}
