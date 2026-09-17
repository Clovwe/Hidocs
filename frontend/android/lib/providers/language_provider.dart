import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageProvider extends ChangeNotifier {
  static const _prefsKey = 'appLanguage';

  Locale _locale = const Locale('id');
  bool _loaded = false;

  Locale get locale => _locale;
  bool get isLoaded => _loaded;

  LanguageProvider() {
    _load();
  }

  String get languageCode => _locale.languageCode;

  Future<void> setLanguage(String languageCode) async {
    final next = Locale(languageCode);
    if (next == _locale) return;

    _locale = next;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefsKey, languageCode);
  }

  Future<void> toggleLanguage() async {
    await setLanguage(_locale.languageCode == 'id' ? 'en' : 'id');
  }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getString(_prefsKey);
    if (saved != null && (saved == 'en' || saved == 'id')) {
      _locale = saved == 'en' ? const Locale('en') : const Locale('id');
    } else {
      _locale = const Locale('id');
    }
    _loaded = true;
    notifyListeners();
  }
}