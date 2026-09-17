import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_theme.dart';
import '../l10n/app_localizations.dart';
import '../models/form_model.dart';
import '../providers/form_provider.dart';
import 'fill_form_screen.dart';

class ExamTokenScreen extends StatefulWidget {
  final FormModel form;

  const ExamTokenScreen({required this.form, super.key});

  @override
  State<ExamTokenScreen> createState() => _ExamTokenScreenState();
}

class _ExamTokenScreenState extends State<ExamTokenScreen> {
  final _tokenCtrl = TextEditingController();
  bool _error = false;
  bool _isChecking = false;
  int _attempts = 0;
  bool _obscure = false;
  String _enteredToken = '';

  bool get _formHasToken => widget.form.hasAccessToken;
  String get _expected => widget.form.accessToken.trim();

  @override
  void dispose() {
    _tokenCtrl.dispose();
    super.dispose();
  }

  void _proceed() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) =>
            FillFormScreen(form: widget.form, preEnteredToken: _enteredToken),
      ),
    );
  }

  Future<void> _verify() async {
    if (_isChecking) return;

    if (!_formHasToken) {
      _proceed();
      return;
    }

    final input = _tokenCtrl.text.trim();

    setState(() {
      _isChecking = true;
      _error = false;
    });

    if (_expected.isNotEmpty) {
      await Future.delayed(const Duration(milliseconds: 400));
      if (!mounted) return;
      if (input.toLowerCase() == _expected.toLowerCase()) {
        _enteredToken = widget.form.accessToken.trim();
        _proceed();
      } else {
        setState(() {
          _isChecking = false;
          _error = true;
          _attempts++;
        });
      }
      return;
    }

    final ok = await Provider.of<FormProvider>(context, listen: false)
        .verifyFormToken(widget.form.slug, input);
    if (!mounted) return;

    if (ok) {
      _enteredToken = input;
      _proceed();
    } else {
      setState(() {
        _isChecking = false;
        _error = true;
        _attempts++;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppTheme.darkBg : AppTheme.surfaceLight,
      appBar: AppBar(
        title: Text(l10n.enterToken),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(28),
        child: Column(
          children: [
            const SizedBox(height: 16),
            Container(
              width: 88,
              height: 88,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primary, AppTheme.primaryLight],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(26),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primary.withValues(alpha: 0.28),
                    blurRadius: 18,
                    offset: const Offset(0, 7),
                  ),
                ],
              ),
              child: const Icon(Icons.vpn_key_rounded,
                  size: 42, color: Colors.white),
            ),
            const SizedBox(height: 24),
            Text(
              widget.form.title,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: isDark ? AppTheme.darkTextPrimary : AppTheme.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.warning.withValues(alpha: 0.10),
                borderRadius: BorderRadius.circular(10),
                border:
                    Border.all(color: AppTheme.warning.withValues(alpha: 0.25)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.vpn_key_rounded, size: 15, color: AppTheme.warning),
                  const SizedBox(width: 6),
                  Text(
                    l10n.whichToken,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.warning,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 28),
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                color: isDark ? AppTheme.darkCard : AppTheme.surfaceCard,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                    color: isDark ? AppTheme.darkBorder : AppTheme.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    l10n.authTokenTitle,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: isDark
                          ? AppTheme.darkTextPrimary
                          : AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    l10n.askTokenFrom,
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? AppTheme.darkTextMuted : AppTheme.textMuted,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _tokenCtrl,
                    obscureText: _obscure,
                    textCapitalization: TextCapitalization.none,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 4,
                      color: isDark
                          ? AppTheme.darkTextPrimary
                          : AppTheme.textPrimary,
                      fontFamily: 'monospace',
                    ),
                    decoration: InputDecoration(
                      hintText: l10n.enterToken,
                      hintStyle: TextStyle(
                        fontSize: 14,
                        letterSpacing: 0,
                        fontWeight: FontWeight.w400,
                        color: isDark
                            ? AppTheme.darkTextMuted
                            : AppTheme.textMuted,
                      ),
                      errorText: _error
                          ? l10n.wrongToken +
                              (_attempts >= 3 ? l10n.tokenEnsureCorrect : '')
                          : null,
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscure
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                          size: 18,
                        ),
                        onPressed: () =>
                            setState(() => _obscure = !_obscure),
                      ),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14)),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 18, vertical: 16),
                    ),
                    onChanged: (_) {
                      if (_error) setState(() => _error = false);
                    },
                    onFieldSubmitted: (_) => _verify(),
                  ),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton.icon(
                      onPressed: _isChecking ? null : _verify,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14)),
                      ),
                      icon: _isChecking
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                  color: Colors.white, strokeWidth: 2.5),
                            )
                          : const Icon(Icons.login_rounded, size: 20),
                      label: Text(
                        _isChecking ? l10n.checking : l10n.continueAction,
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                l10n.cancel,
                style: TextStyle(
                  color: isDark ? AppTheme.darkTextMuted : AppTheme.textMuted,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

