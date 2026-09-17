import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_theme.dart';
import '../providers/auth_provider.dart';
import '../providers/form_provider.dart';
import '../providers/response_provider.dart';
import '../models/form_model.dart';
import '../models/question_model.dart';
import '../services/question_image_renderer.dart';
import '../widgets/gradient_button.dart';
import '../widgets/math_formula_widget.dart';
import '../widgets/code_block_widget.dart';
import '../widgets/image_zoom_widget.dart';
import '../widgets/timer_widget.dart';
import '../widgets/audio_player_widget.dart';
import '../widgets/rich_text_view.dart';
import '../l10n/app_localizations.dart';

class FillFormScreen extends StatefulWidget {
  final FormModel form;
  final String preEnteredToken;

  const FillFormScreen({
    required this.form,
    this.preEnteredToken = '',
    super.key,
  });

  @override
  State<FillFormScreen> createState() => _FillFormScreenState();
}

class _FillFormScreenState extends State<FillFormScreen> {
  late List<QuestionModel> _questions;

  final Map<String, dynamic> _answers = {};
  final Map<String, TextEditingController> _controllers = {};
  final Set<int> _flags = {};

  late String _token;

  Timer? _timer;

  int _remaining = 0;
  int _current = 0;

  bool _submitted = false;
  bool _isSubmitting = false;

  final TransformationController _zoomController = TransformationController();
  final ScrollController _numberStripController = ScrollController();
  double _zoomScale = 1.0;

  void _zoomIn() {
    setState(() {
      _zoomScale = (_zoomScale + 0.2).clamp(0.8, 2.5);
      _zoomController.value = Matrix4.diagonal3Values(_zoomScale, _zoomScale, 1.0);
    });
  }

  void _zoomOut() {
    setState(() {
      _zoomScale = (_zoomScale - 0.2).clamp(0.8, 2.5);
      _zoomController.value = Matrix4.diagonal3Values(_zoomScale, _zoomScale, 1.0);
    });
  }

  void _resetZoom() {
    setState(() {
      _zoomScale = 1.0;
      _zoomController.value = Matrix4.identity();
    });
  }

  @override
  void initState() {
    super.initState();

    _questions = List<QuestionModel>.from(
      widget.form.questions,
    );

    _token = widget.preEnteredToken.isNotEmpty
        ? widget.preEnteredToken
        : widget.form.accessToken;

    QuestionImageRenderer.warmup().then((_) {
      if (mounted) setState(() {});
    });

    if (widget.form.shuffleQuestions) {
      _questions.shuffle();
    }

    if (widget.form.shuffleOptions) {
      _questions = _questions.map((q) {
        if ((q.type == QuestionType.multipleChoice ||
                q.type == QuestionType.checkbox ||
                q.type == QuestionType.imageChoice) &&
            q.options.isNotEmpty) {
          final shuffledOptions =
              List<OptionModel>.from(q.options);

          shuffledOptions.shuffle();

          return q.copyWith(options: shuffledOptions);
        }

        return q;
      }).toList();
    }

    if (widget.form.hasTimer) {
      _remaining = widget.form.timerMinutes * 60;

      _timer = Timer.periodic(
        const Duration(seconds: 1),
        (_) {
          if (!mounted || _submitted) return;

          if (_remaining <= 1) {
            _timer?.cancel();
            _remaining = 0;
            _autoSubmit();
          } else {
            setState(() {
              _remaining--;
            });
          }
        },
      );
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _zoomController.dispose();
    _numberStripController.dispose();

    for (final controller in _controllers.values) {
      controller.dispose();
    }

    super.dispose();
  }

  TextEditingController _getController(
    String questionId,
  ) {
    if (!_controllers.containsKey(questionId)) {
      _controllers[questionId] = TextEditingController(
        text: _answers[questionId]?.toString() ?? '',
      );
    }

    return _controllers[questionId]!;
  }

  void _autoSubmit() {
    if (_submitted || _isSubmitting) return;

    _submitForm(
      auto: true,
    );
  }

  Future<void> _submitForm({
    bool auto = false,
  }) async {
    if (_submitted || _isSubmitting) return;

    final l10n = AppLocalizations.of(context);

    if (!auto) {
      final unanswered = _questions.where(
        (question) {
          if (!question.isRequired) {
            return false;
          }

          final answer = _answers[question.id];

          if (answer == null) {
            return true;
          }

          if (answer is String &&
              answer.trim().isEmpty) {
            return true;
          }

          if (answer is int && answer == 0) {
            return true;
          }

          if (question.type == QuestionType.matching && answer is Map) {
            return answer.values.any((v) => v.toString().trim().isEmpty);
          }

          if (question.type == QuestionType.checkbox && answer is Set) {
            return (answer).isEmpty;
          }

          return false;
        },
      ).toList();

      if (unanswered.isNotEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(
                  Icons.warning_amber_rounded,
                  color: Colors.white,
                  size: 20,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    l10n.answerRequired,
                  ),
                ),
              ],
            ),
            backgroundColor: AppTheme.warning,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );

        return;
      }
    }

    _timer?.cancel();

    setState(() {
      _isSubmitting = true;
    });

    final formProvider = Provider.of<FormProvider>(
      context,
      listen: false,
    );

    final auth = Provider.of<AuthProvider>(
      context,
      listen: false,
    );

    final answers = <Map<String, dynamic>>[];

    for (final q in _questions) {
      final value = _answers[q.id];

      if (value == null) {
        continue;
      }

      if (value is String && value.trim().isEmpty) {
        continue;
      }

      if (q.type == QuestionType.multipleChoice ||
          q.type == QuestionType.imageChoice ||
          q.type == QuestionType.yesNo) {
        answers.add({
          'question_id': q.id,
          'selected_option_id': value,
          'answer_text': null,
        });
      } else if (q.type == QuestionType.checkbox) {
        final selectedIds = value is Set<String>
            ? value.toList()
            : <String>[];
        for (final optId in selectedIds) {
          answers.add({
            'question_id': q.id,
            'selected_option_id': optId,
            'answer_text': null,
          });
        }
      } else if (q.type == QuestionType.matching) {
        final matchMap = value is Map ? Map<String, String>.from(
          value.map((k, v) => MapEntry(k.toString(), v.toString())),
        ) : <String, String>{};
        final encoded = jsonEncode(matchMap);
        answers.add({
          'question_id': q.id,
          'selected_option_id': null,
          'answer_text': encoded,
        });
      } else {
        answers.add({
          'question_id': q.id,
          'selected_option_id': null,
          'answer_text': value.toString(),
        });
      }
    }

    final result = await formProvider.submitForm(
      widget.form.id,
      respondentEmail: auth.currentUser?.email ?? '',
      answers: answers,
      auto: auto,
      token: _token,
    );

    if (!mounted) {
      return;
    }

    if (result == null) {
      final errorMessage = formProvider.error ??
          l10n.failSendResp;

      formProvider.clearError();

      setState(() {
        _isSubmitting = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(
                Icons.error_outline_rounded,
                color: Colors.white,
                size: 18,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  errorMessage,
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
          backgroundColor: AppTheme.error,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );

      return;
    }

    setState(() {
      _isSubmitting = false;
      _submitted = true;
    });

    Provider.of<ResponseProvider>(
      context,
      listen: false,
    ).recordSubmission(
      formId: widget.form.id,
      formTitle: widget.form.title,
      responseId: (result['response_id'] ?? '').toString(),
      respondentId: auth.currentUser?.id ?? '',
      respondentEmail: auth.currentUser?.email ?? '',
      answers: Map<String, dynamic>.from(_answers),
      totalScore: (result['total_score'] as num?)?.toDouble(),
      submittedAt:
          DateTime.tryParse(result['submitted_at']?.toString() ?? ''),
      maxScore: widget.form.maxScore,
    );

    if (auto && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(
                Icons.timer_off_rounded,
                color: Colors.white,
                size: 18,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  l10n.timeUpAutoSubmit,
                ),
              ),
            ],
          ),
          backgroundColor: AppTheme.warning,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
    }
  }

  void _scrollToStrip(int index) {
    if (!_numberStripController.hasClients) return;
    final targetOffset = (index * 44.0) - 100.0;
    _numberStripController.animateTo(
      targetOffset.clamp(0.0, _numberStripController.position.maxScrollExtent),
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeOut,
    );
  }

  void _nextQuestion() {
    if (_current < _questions.length - 1) {
      setState(() {
        _current++;
      });
      _scrollToStrip(_current);
    }
  }

  void _previousQuestion() {
    if (_current > 0) {
      setState(() {
        _current--;
      });
      _scrollToStrip(_current);
    }
  }

  void _jumpToQuestion(int index) {
    if (index >= 0 && index < _questions.length) {
      setState(() => _current = index);
      _scrollToStrip(_current);
    }
  }

  bool _isAnswered(int index) {
    if (index < 0 || index >= _questions.length) return false;
    final q = _questions[index];
    final answer = _answers[q.id];
    if (answer == null) return false;
    if (answer is String) return answer.trim().isNotEmpty;
    if (answer is int) return answer != 0;
    if (answer is Set) return answer.isNotEmpty;
    if (answer is Map) return answer.values.any((v) => v.toString().trim().isNotEmpty);
    return answer.toString().trim().isNotEmpty;
  }

  void _toggleFlag(int i) {
    setState(() {
      if (!_flags.add(i)) {
        _flags.remove(i);
      }
    });
  }

  void _showQuestionPanel(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      backgroundColor:
          Theme.of(context).brightness == Brightness.dark
              ? AppTheme.darkCard
              : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        final isDark = Theme.of(ctx).brightness == Brightness.dark;
        final mutedColor =
            isDark ? AppTheme.darkTextMuted : AppTheme.textMuted;
        final answeredCount = _questions
            .where((q) => _isAnswered(_questions.indexOf(q)))
            .length;

        return Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                l10n.questionNo,
                style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 16,
                runSpacing: 8,
                children: [
                  _LegendDot(
                    current: true,
                    color: AppTheme.primary,
                    label: l10n.navLegendCurrent,
                  ),
                  _LegendDot(
                    color: AppTheme.success,
                    label: l10n.navLegendAnswered,
                  ),
                  _LegendDot(
                    color: AppTheme.warning,
                    label: l10n.navLegendFlagged,
                  ),
                  _LegendDot(
                    outlined: true,
                    color: mutedColor,
                    label: l10n.navLegendUnanswered,
                  ),
                ],
              ),
              const SizedBox(height: 16),

              Flexible(
                child: SingleChildScrollView(
                  child: Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: List.generate(_questions.length, (i) {
                      final isCurrent = i == _current;
                      final isFlaggedQ = _flags.contains(i);
                      final isAnswered = _isAnswered(i);

                      Color bg;
                      Color fg;
                      Color borderC;
                      if (isCurrent) {
                        bg = AppTheme.primary;
                        fg = Colors.white;
                        borderC = AppTheme.primary;
                      } else if (isFlaggedQ) {
                        bg = AppTheme.warning.withValues(alpha: 0.15);
                        fg = AppTheme.warning;
                        borderC = AppTheme.warning.withValues(alpha: 0.40);
                      } else if (isAnswered) {
                        bg = AppTheme.success.withValues(alpha: 0.12);
                        fg = AppTheme.success;
                        borderC = AppTheme.success.withValues(alpha: 0.30);
                      } else {
                        bg = isDark
                            ? AppTheme.darkSurface
                            : AppTheme.surfaceLight;
                        fg = mutedColor;
                        borderC = isDark ? AppTheme.darkBorder : AppTheme.border;
                      }

                      return GestureDetector(
                        onTap: () {
                          _jumpToQuestion(i);
                          Navigator.of(ctx).pop();
                        },
                        child: Container(
                          width: 46,
                          height: 46,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: bg,
                            border: Border.all(
                              color: borderC,
                              width: isCurrent ? 2.5 : 1.5,
                            ),
                          ),
                          child: Center(
                            child: Text(
                              '${i + 1}',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: fg,
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: isDark
                      ? AppTheme.darkSurface
                      : AppTheme.surfaceLight,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _SummaryLine(
                      icon: Icons.check_circle_rounded,
                      color: AppTheme.success,
                      text: l10n.answeredSummary(answeredCount),
                    ),
                    _SummaryLine(
                      icon: Icons.flag_rounded,
                      color: AppTheme.warning,
                      text: l10n.flaggedSummary(_flags.length),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    if (_questions.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: Text(widget.form.title),
        ),
        body: Center(
          child: Text(
            l10n.noQuestionsYetF,
          ),
        ),
      );
    }

    if (_submitted) {
      return _SuccessScreen(
        onBack: () => Navigator.pop(context),
      );
    }

    final q = _questions[_current];

    final questionImagePath = QuestionImageRenderer.pathFor(q);

    final progress =
        (_current + 1) / _questions.length;

    final isDark =
        Theme.of(context).brightness ==
            Brightness.dark;

    final isWarn =
        widget.form.hasTimer &&
        _remaining < 60;

    return Scaffold(
      backgroundColor:
          isDark
              ? AppTheme.darkBg
              : AppTheme.surfaceLight,

      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(
          widget.form.title,
          style: const TextStyle(
            fontSize: 16,
          ),
          overflow: TextOverflow.ellipsis,
        ),
        actions: [
          
          IconButton(
            icon: Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(Icons.grid_view_rounded, size: 22),
                if (_flags.isNotEmpty)
                  Positioned(
                    right: -4,
                    top: -4,
                    child: Container(
                      width: 14,
                      height: 14,
                      decoration: const BoxDecoration(
                        color: AppTheme.warning,
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          '${_flags.length}',
                          style: const TextStyle(
                            fontSize: 8,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            tooltip: l10n.questionNo,
            onPressed: () => _showQuestionPanel(context),
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                icon: const Icon(Icons.zoom_out_rounded, size: 20),
                tooltip: l10n.zoomOut,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                onPressed: _zoomScale > 0.8 ? _zoomOut : null,
              ),
              InkWell(
                onTap: _resetZoom,
                borderRadius: BorderRadius.circular(4),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                  child: Text(
                    '${(_zoomScale * 100).round()}%',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.zoom_in_rounded, size: 20),
                tooltip: l10n.zoomIn,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                onPressed: _zoomScale < 2.5 ? _zoomIn : null,
              ),
              const SizedBox(width: 4),
            ],
          ),
          if (widget.form.hasTimer)
            Padding(
              padding: const EdgeInsets.only(
                right: 12,
                top: 8,
                bottom: 8,
              ),
              child: TimerWidget(
                remainingSeconds: _remaining,
                isWarning: isWarn,
              ),
            ),
        ],
      ),

      body: Column(
        children: [
          Container(
            height: 4,
            color: isDark
                ? AppTheme.darkBorder
                : AppTheme.border,
            child: FractionallySizedBox(
              alignment:
                  Alignment.centerLeft,
              widthFactor: progress,
              child: Container(
                decoration:
                    const BoxDecoration(
                  gradient:
                      LinearGradient(
                    colors: [
                      AppTheme.primary,
                      AppTheme.primaryLight,
                    ],
                  ),
                ),
              ),
            ),
          ),

          Container(
            height: 50,
            decoration: BoxDecoration(
              color: isDark ? AppTheme.darkCard : Colors.white,
              border: Border(
                bottom: BorderSide(
                  color: isDark ? AppTheme.darkBorder : AppTheme.border,
                ),
              ),
            ),
            child: ListView.builder(
              controller: _numberStripController,
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
              itemCount: _questions.length,
              itemBuilder: (context, i) {
                final isCurrent = i == _current;
                final isFlaggedQ = _flags.contains(i);
                final isAns = _isAnswered(i);

                Color bg;
                Color fg;
                Color borderC;

                if (isCurrent) {
                  bg = AppTheme.primary;
                  fg = Colors.white;
                  borderC = AppTheme.primary;
                } else if (isFlaggedQ) {
                  bg = AppTheme.warning.withValues(alpha: 0.18);
                  fg = AppTheme.warning;
                  borderC = AppTheme.warning;
                } else if (isAns) {
                  bg = AppTheme.success.withValues(alpha: 0.15);
                  fg = AppTheme.success;
                  borderC = AppTheme.success.withValues(alpha: 0.5);
                } else {
                  bg = isDark ? AppTheme.darkSurface : AppTheme.surfaceLight;
                  fg = isDark ? AppTheme.darkTextMuted : AppTheme.textMuted;
                  borderC = isDark ? AppTheme.darkBorder : AppTheme.border;
                }

                return GestureDetector(
                  onTap: () => _jumpToQuestion(i),
                  child: Container(
                    width: 36,
                    height: 36,
                    margin: const EdgeInsets.only(right: 8),
                    decoration: BoxDecoration(
                      color: bg,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: borderC,
                        width: isCurrent ? 2.0 : 1.2,
                      ),
                      boxShadow: isCurrent
                          ? [
                              BoxShadow(
                                color: AppTheme.primary.withValues(alpha: 0.3),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              )
                            ]
                          : null,
                    ),
                    child: Center(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            '${i + 1}',
                            style: TextStyle(
                              color: fg,
                              fontSize: 13,
                              fontWeight: isCurrent ? FontWeight.w800 : FontWeight.w600,
                            ),
                          ),
                          if (isFlaggedQ && !isCurrent) ...[
                            const SizedBox(width: 1),
                            Icon(Icons.flag_rounded, size: 9, color: fg),
                          ],
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          Expanded(
            child: InteractiveViewer(
              transformationController: _zoomController,
              minScale: 0.8,
              maxScale: 2.5,
              panEnabled: true,
              scaleEnabled: true,
              onInteractionEnd: (_) {
                setState(() {
                  _zoomScale = _zoomController.value.getMaxScaleOnAxis();
                });
              },
              child: SingleChildScrollView(
                padding:
                    const EdgeInsets.all(24),
                child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Container(
                          padding:
                              const EdgeInsets
                                  .symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration:
                              BoxDecoration(
                            color:
                                AppTheme.primary,
                            borderRadius:
                                BorderRadius
                                    .circular(
                              20,
                            ),
                          ),
                          child: Text(
                            l10n.questionOf(_current + 1, _questions.length),
                            overflow:
                                TextOverflow
                                    .ellipsis,
                            style:
                                const TextStyle(
                              color:
                                  Colors.white,
                              fontWeight:
                                  FontWeight.w700,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ),

                      if (q.isRequired) ...[
                        const SizedBox(
                          width: 8,
                        ),
                        Container(
                          padding:
                              const EdgeInsets
                                  .symmetric(
                            horizontal: 8,
                            vertical: 5,
                          ),
                          decoration:
                              BoxDecoration(
                            color:
                                AppTheme
                                    .errorLight,
                            borderRadius:
                                BorderRadius
                                    .circular(
                              10,
                            ),
                          ),
                          child:
                              Text(
                            l10n.required,
                            style:
                                const TextStyle(
                              fontSize: 10,
                              fontWeight:
                                  FontWeight
                                      .w700,
                              color:
                                  AppTheme
                                      .error,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),

                  const SizedBox(height: 18),

                  if (questionImagePath != null) ...[
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => FullScreenImageViewer(
                              filePath: questionImagePath,
                            ),
                          ),
                        );
                      },
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(14),
                        child: SizedBox(
                          width: double.infinity,
                          child: Image.file(
                            File(questionImagePath),
                            fit: BoxFit.fitWidth,
                            errorBuilder: (_, __, ___) => const SizedBox(
                              height: 80,
                              child: Center(
                                child: Icon(
                                  Icons.broken_image_outlined,
                                  color: AppTheme.textMuted,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 22),
                  ] else ...[
                    Text(
                      q.text,
                      style: TextStyle(
                        fontSize: 19,
                        fontWeight:
                            FontWeight.w700,
                        color: isDark
                            ? AppTheme
                                .darkTextPrimary
                            : AppTheme
                                .textPrimary,
                        height: 1.35,
                      ),
                    ),

                    const SizedBox(height: 22),

                    if (q.type ==
                            QuestionType
                                .mathFormula &&
                        q.mathFormula != null) ...[
                      MathFormulaWidget(
                        formula:
                            q.mathFormula!,
                      ),
                      const SizedBox(
                        height: 20,
                      ),
                    ],

                    if (q.type ==
                            QuestionType
                                .codeInput &&
                        q.codeSnippet != null) ...[
                      CodeBlockWidget(
                        code:
                            q.codeSnippet!,
                      ),
                      const SizedBox(
                        height: 20,
                      ),
                    ],

                    if (q.imageUrl != null) ...[
                      ImageZoomWidget(
                        imageUrl:
                            q.imageUrl!,
                      ),
                      const SizedBox(
                        height: 20,
                      ),
                    ],

                    if (q.audioUrl != null) ...[
                      AudioPlayerWidget(audioSource: q.audioUrl!),
                      const SizedBox(height: 20),
                    ],
                  ],

                  _buildAnswer(
                    q,
                    isDark,
                  ),

                  const SizedBox(height: 16),
                  GestureDetector(
                    onTap: () => _toggleFlag(_current),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: _flags.contains(_current)
                            ? AppTheme.warning.withValues(alpha: 0.12)
                            : (isDark
                                ? AppTheme.darkCard
                                : AppTheme.surfaceCard),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _flags.contains(_current)
                              ? AppTheme.warning.withValues(alpha: 0.40)
                              : (isDark
                                  ? AppTheme.darkBorder
                                  : AppTheme.border),
                          width: _flags.contains(_current) ? 1.5 : 1,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.flag_rounded,
                            size: 16,
                            color: _flags.contains(_current)
                                ? AppTheme.warning
                                : (isDark
                                    ? AppTheme.darkTextMuted
                                    : AppTheme.textMuted),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            _flags.contains(_current)
                                ? l10n.unflagQuestion
                                : l10n.flagQuestion,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: _flags.contains(_current)
                                  ? AppTheme.warning
                                  : (isDark
                                      ? AppTheme.darkTextMuted
                                      : AppTheme.textMuted),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

          _NavBar(
            current: _current,
            total: _questions.length,
            flaggedCount: _flags.length,
            isFlagged: _flags.contains(_current),
            onPrev:
                _previousQuestion,
            onNext:
                _nextQuestion,
            onSubmit:
                () => _submitForm(),
            onOpenPanel:
                () => _showQuestionPanel(context),
            onToggleFlag:
                () => _toggleFlag(_current),
          ),
        ],
      ),
    );
  }

  Widget _buildAnswer(
    QuestionModel q,
    bool isDark,
  ) {
    final l10n = AppLocalizations.of(context);

    switch (q.type) {
      case QuestionType.multipleChoice:
        return _MCAnswer(
          q: q,
          answers: _answers,
          isDark: isDark,
          onSelect: (id) {
            setState(() {
              _answers[q.id] = id;
            });
          },
        );

      case QuestionType.checkbox:
        final selected = (_answers[q.id] is Set<String>)
            ? _answers[q.id] as Set<String>
            : <String>{};
        return _CheckboxAnswer(
          q: q,
          selected: selected,
          isDark: isDark,
          onToggle: (id) {
            setState(() {
              final s = Set<String>.from(selected);
              if (s.contains(id)) {
                s.remove(id);
              } else {
                s.add(id);
              }
              _answers[q.id] = s;
            });
          },
        );

      case QuestionType.shortText:
        return _TextAnswer(
          controller:
              _getController(q.id),
          hint: l10n.shortAnsHint,
          maxLines: 1,
          onChanged: (v) {
            _answers[q.id] = v;
          },
        );

      case QuestionType.longText:
      case QuestionType.codeInput:
        return _TextAnswer(
          controller:
              _getController(q.id),
          hint:
              q.type ==
                      QuestionType
                          .codeInput
                  ? l10n.writeCodeHint
                  : l10n.typingAnsHint,
          maxLines: 6,
          monospace:
              q.type ==
                  QuestionType
                      .codeInput,
          onChanged: (v) {
            _answers[q.id] = v;
          },
        );

      case QuestionType.mathFormula:
        return _TextAnswer(
          controller:
              _getController(q.id),
          hint: l10n.writeFormulaHint,
          maxLines: 3,
          onChanged: (v) {
            _answers[q.id] = v;
          },
        );

      case QuestionType.rating:
        final rating =
            (_answers[q.id] as int?) ??
                0;

        return _RatingAnswer(
          rating: rating,
          max:
              q.ratingMax ?? 5,
          onRate: (r) {
            setState(() {
              _answers[q.id] = r;
            });
          },
        );

      case QuestionType.yesNo:
        return _YesNoAnswer(
          value:
              _answers[q.id] as String?,
          onSelect: (yes) {
            setState(() {
              _answers[q.id] =
                  _yesNoOptionId(q, yes);
            });
          },
        );

      case QuestionType.imageChoice:
        return _MCAnswer(
          q: q,
          answers: _answers,
          isDark: isDark,
          onSelect: (id) {
            setState(() {
              _answers[q.id] = id;
            });
          },
        );

      case QuestionType.matching:
        final rawAnswer = _answers[q.id];
        Map<String, String> currentMap = {};
        if (rawAnswer is Map) {
          currentMap = Map<String, String>.from(
            rawAnswer.map((k, v) => MapEntry(k.toString(), v.toString())),
          );
        }
        return _MatchingAnswer(
          question: q,
          currentAnswers: currentMap,
          isDark: isDark,
          onChanged: (map) {
            setState(() {
              _answers[q.id] = map;
            });
          },
        );
    }
  }

  String? _yesNoOptionId(
    QuestionModel q,
    bool yes,
  ) {
    for (final opt in q.options) {
      final t = opt.text.trim().toLowerCase();
      if (yes &&
          (t == 'yes' || t == 'ya')) {
        return opt.id;
      }
      if (!yes &&
          (t == 'no' || t == 'tidak')) {
        return opt.id;
      }
    }

    if (q.options.isNotEmpty) {
      return yes
          ? q.options.first.id
          : q.options.last.id;
    }

    return null;
  }
}

class _SuccessScreen
    extends StatelessWidget {
  final VoidCallback onBack;

  const _SuccessScreen({
    required this.onBack,
  });

  @override
  Widget build(
    BuildContext context,
  ) {
    final l10n =
        AppLocalizations.of(context);

    final isDark =
        Theme.of(context).brightness ==
            Brightness.dark;

    return Scaffold(
      backgroundColor: isDark
          ? AppTheme.darkBg
          : AppTheme.surfaceLight,
      body: Center(
        child: SingleChildScrollView(
          padding:
              const EdgeInsets.all(40),
          child: Column(
            mainAxisSize:
                MainAxisSize.min,
            children: [
              Container(
                width: 96,
                height: 96,
                decoration:
                    BoxDecoration(
                  color: AppTheme.success
                      .withValues(
                    alpha: 0.10,
                  ),
                  shape:
                      BoxShape.circle,
                ),
                child: const Icon(
                  Icons
                      .check_circle_rounded,
                  color:
                      AppTheme.success,
                  size: 52,
                ),
              ),

              const SizedBox(
                height: 28,
              ),

              Text(
                l10n.thankYou,
                style: TextStyle(
                  fontSize: 30,
                  fontWeight:
                      FontWeight.w800,
                  color: isDark
                      ? AppTheme
                          .darkTextPrimary
                      : AppTheme
                          .textPrimary,
                  letterSpacing: -0.5,
                ),
              ),

              const SizedBox(
                height: 8,
              ),

              Text(
                l10n.submitSuccess,
                style: TextStyle(
                  fontSize: 15,
                  color: isDark
                      ? AppTheme
                          .darkTextSecondary
                      : AppTheme
                          .textMuted,
                ),
                textAlign:
                    TextAlign.center,
              ),

              const SizedBox(
                height: 36,
              ),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: GradientButton(
                  text: l10n.backToHome,
                  onPressed: onBack,
                  icon:
                      Icons.home_rounded,
                  fullWidth: true,
                  height: 50,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavBar
    extends StatelessWidget {
  final int current;
  final int total;
  final int flaggedCount;
  final bool isFlagged;
  final VoidCallback onPrev;
  final VoidCallback onNext;
  final VoidCallback onSubmit;
  final VoidCallback onOpenPanel;
  final VoidCallback onToggleFlag;

  const _NavBar({
    required this.current,
    required this.total,
    required this.flaggedCount,
    required this.isFlagged,
    required this.onPrev,
    required this.onNext,
    required this.onSubmit,
    required this.onOpenPanel,
    required this.onToggleFlag,
  });

  @override
  Widget build(
    BuildContext context,
  ) {
    final l10n =
        AppLocalizations.of(context);

    final isDark =
        Theme.of(context).brightness ==
            Brightness.dark;

    final isLast =
        current == total - 1;

    final isFirst =
        current == 0;

    return Container(
      width: double.infinity,
      padding:
          const EdgeInsets.fromLTRB(
        16,
        8,
        16,
        20,
      ),
      decoration:
          BoxDecoration(
        color: isDark
            ? AppTheme.darkCard
            : AppTheme.surfaceCard,
        borderRadius:
            const BorderRadius.vertical(top: Radius.circular(20)),
        border: Border(
          top: BorderSide(
            color: isDark
                ? AppTheme.darkBorder
                : AppTheme.border,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black
                .withValues(
              alpha: 0.05,
            ),
            blurRadius: 24,
            offset:
                const Offset(0, -8),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (flaggedCount > 0) ...[
              InkWell(
                onTap: onOpenPanel,
                borderRadius: BorderRadius.circular(10),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.warning.withValues(alpha: 0.10),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                        color: AppTheme.warning.withValues(alpha: 0.25)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.flag_rounded,
                          size: 14, color: AppTheme.warning),
                      const SizedBox(width: 6),
                      Text(
                        l10n.flagCountNote(flaggedCount),
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.warning,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
            Row(
              children: [
                SizedBox(
                  width: 44,
                  height: 50,
                  child: IconButton(
                    icon: const Icon(Icons.grid_view_rounded, size: 20),
                    tooltip: l10n.questionNo,
                    padding: EdgeInsets.zero,
                    onPressed: onOpenPanel,
                  ),
                ),
                const SizedBox(width: 4),
                if (!isFirst) ...[
                  Expanded(
                    flex: 1,
                    child: SizedBox(
                      height: 50,
                      child: OutlinedButton(
                        onPressed: onPrev,
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: const Icon(Icons.arrow_back_rounded, size: 20),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                ],

                Expanded(
                  flex: 2,
                  child: SizedBox(
                    height: 50,
                    child: isLast
                        ? _SafeGradientButton(
                            text: l10n.submitResponse,
                            icon: Icons.send_rounded,
                            onPressed: onSubmit,
                          )
                        : _SafeGradientButton(
                            text: l10n.next,
                            icon: Icons.arrow_forward_rounded,
                            onPressed: onNext,
                          ),
                  ),
                ),
                const SizedBox(width: 8),
                SizedBox(
                  width: 44,
                  height: 50,
                  child: IconButton(
                    icon: Icon(
                      Icons.flag_rounded,
                      size: 20,
                      color: isFlagged
                          ? AppTheme.warning
                          : (isDark ? AppTheme.darkTextMuted : AppTheme.textMuted),
                    ),
                    tooltip: isFlagged ? l10n.unflagQuestion : l10n.flagQuestion,
                    padding: EdgeInsets.zero,
                    onPressed: onToggleFlag,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _SafeGradientButton
    extends StatelessWidget {
  final String text;
  final IconData icon;
  final VoidCallback onPressed;

  const _SafeGradientButton({
    required this.text,
    required this.icon,
    required this.onPressed,
  });

  @override
  Widget build(
    BuildContext context,
  ) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onPressed,
        borderRadius:
            BorderRadius.circular(
          14,
        ),
        child: Ink(
          decoration:
              BoxDecoration(
            gradient:
                const LinearGradient(
              colors: [
                AppTheme.primary,
                AppTheme.primaryLight,
              ],
            ),
            borderRadius:
                BorderRadius.circular(
              14,
            ),
          ),
          child: Padding(
            padding:
                const EdgeInsets
                    .symmetric(
              horizontal: 12,
            ),
            child: Row(
              mainAxisAlignment:
                  MainAxisAlignment
                      .center,
              children: [
                Icon(
                  icon,
                  color:
                      Colors.white,
                  size: 19,
                ),
                const SizedBox(
                  width: 6,
                ),
                Flexible(
                  child: Text(
                    text,
                    maxLines: 1,
                    overflow:
                        TextOverflow
                            .ellipsis,
                    textAlign:
                        TextAlign.center,
                    style:
                        const TextStyle(
                      color:
                          Colors.white,
                      fontSize: 13,
                      fontWeight:
                          FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MCAnswer
    extends StatelessWidget {
  final QuestionModel q;
  final Map<String, dynamic> answers;
  final bool isDark;
  final void Function(String) onSelect;

  const _MCAnswer({
    required this.q,
    required this.answers,
    required this.isDark,
    required this.onSelect,
  });

  @override
  Widget build(
    BuildContext context,
  ) {
    return Column(
      children: q.options.map(
        (opt) {
          final selected =
              answers[q.id] ==
                  opt.id;

          return GestureDetector(
            onTap: () =>
                onSelect(opt.id),
            child:
                AnimatedContainer(
              duration:
                  const Duration(
                milliseconds: 200,
              ),
              margin:
                  const EdgeInsets
                      .only(
                bottom: 10,
              ),
              padding:
                  const EdgeInsets
                      .symmetric(
                horizontal: 16,
                vertical: 14,
              ),
              decoration:
                  BoxDecoration(
                color: selected
                    ? AppTheme
                        .primary
                        .withValues(
                        alpha: 0.07,
                      )
                    : (isDark
                        ? AppTheme
                            .darkCard
                        : AppTheme
                            .surfaceCard),
                borderRadius:
                    BorderRadius
                        .circular(
                  14,
                ),
                border:
                    Border.all(
                  color: selected
                      ? AppTheme
                          .primary
                      : (isDark
                          ? AppTheme
                              .darkBorder
                          : AppTheme
                              .border),
                  width:
                      selected
                          ? 2
                          : 1,
                ),
              ),
              child: Row(
                children: [
                  AnimatedContainer(
                    duration:
                        const Duration(
                      milliseconds:
                          200,
                    ),
                    width: 22,
                    height: 22,
                    decoration:
                        BoxDecoration(
                      shape:
                          BoxShape
                              .circle,
                      color: selected
                          ? AppTheme
                              .primary
                          : Colors
                              .transparent,
                      border:
                          Border.all(
                        color: selected
                            ? AppTheme
                                .primary
                            : (isDark
                                ? AppTheme
                                    .darkBorder
                                : AppTheme
                                    .border),
                        width: 2,
                      ),
                    ),
                    child: selected
                        ? const Icon(
                            Icons
                                .check_rounded,
                            size: 14,
                            color: Colors
                                .white,
                          )
                        : null,
                  ),

                  const SizedBox(
                    width: 12,
                  ),

                  Expanded(
                    child: Column(
                      crossAxisAlignment:
                          CrossAxisAlignment.start,
                      children: [
                        if (opt.imageUrl != null) ...[
                          ClipRRect(
                            borderRadius:
                                BorderRadius.circular(10),
                            child: Image.network(
                              opt.imageUrl!,
                              width: double.infinity,
                              height: 120,
                              fit: BoxFit.cover,
                              errorBuilder:
                                  (_, __, ___) => const SizedBox(
                                height: 60,
                                child: Center(
                                  child: Icon(
                                    Icons.broken_image_outlined,
                                    color:
                                        AppTheme.textMuted,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(
                            height: 8,
                          ),
                        ],
                        if (opt.content != null && opt.content!.isNotEmpty)
                          RichTextContentView(
                            content: opt.content,
                            fallbackText: opt.text,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: selected
                                  ? FontWeight.w600
                                  : FontWeight.w400,
                              color: selected
                                  ? AppTheme.primary
                                  : (isDark
                                      ? AppTheme.darkTextSecondary
                                      : AppTheme.textSecondary),
                            ),
                          )
                        else
                          Text(
                            opt.text,
                            style:
                                TextStyle(
                              fontSize: 15,
                              fontWeight:
                                  selected
                                      ? FontWeight
                                          .w600
                                      : FontWeight
                                          .w400,
                              color: selected
                                  ? AppTheme
                                      .primary
                                  : (isDark
                                      ? AppTheme
                                          .darkTextSecondary
                                      : AppTheme
                                          .textSecondary),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ).toList(),
    );
  }
}

class _CheckboxAnswer extends StatelessWidget {
  final QuestionModel q;
  final Set<String> selected;
  final bool isDark;
  final void Function(String) onToggle;

  const _CheckboxAnswer({
    required this.q,
    required this.selected,
    required this.isDark,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: AppTheme.info.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppTheme.info.withValues(alpha: 0.25)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.info_outline_rounded,
                  size: 14, color: AppTheme.info),
              const SizedBox(width: 6),
              Text(
                l10n.chooseMultiple,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.info,
                ),
              ),
            ],
          ),
        ),
        ...q.options.map((opt) {
          final isSelected = selected.contains(opt.id);

          return GestureDetector(
            onTap: () => onToggle(opt.id),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppTheme.primary.withValues(alpha: 0.07)
                    : (isDark ? AppTheme.darkCard : AppTheme.surfaceCard),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isSelected
                      ? AppTheme.primary
                      : (isDark ? AppTheme.darkBorder : AppTheme.border),
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: Row(
                children: [
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(6),
                      color: isSelected ? AppTheme.primary : Colors.transparent,
                      border: Border.all(
                        color: isSelected
                            ? AppTheme.primary
                            : (isDark ? AppTheme.darkBorder : AppTheme.border),
                        width: 2,
                      ),
                    ),
                    child: isSelected
                        ? const Icon(Icons.check_rounded,
                            size: 14, color: Colors.white)
                        : null,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (opt.imageUrl != null) ...[
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Image.network(
                              opt.imageUrl!,
                              width: double.infinity,
                              height: 120,
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => const SizedBox(
                                height: 60,
                                child: Center(
                                  child: Icon(Icons.broken_image_outlined,
                                      color: AppTheme.textMuted),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                        ],
                        if (opt.content != null && opt.content!.isNotEmpty)
                          RichTextContentView(
                            content: opt.content,
                            fallbackText: opt.text,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight:
                                  isSelected ? FontWeight.w600 : FontWeight.w400,
                              color: isSelected
                                  ? AppTheme.primary
                                  : (isDark
                                      ? AppTheme.darkTextSecondary
                                      : AppTheme.textSecondary),
                            ),
                          )
                        else
                          Text(
                            opt.text,
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight:
                                  isSelected ? FontWeight.w600 : FontWeight.w400,
                              color: isSelected
                                  ? AppTheme.primary
                                  : (isDark
                                      ? AppTheme.darkTextSecondary
                                      : AppTheme.textSecondary),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}

class _TextAnswer
    extends StatelessWidget {
  final TextEditingController controller;
  final String hint;
  final int maxLines;
  final bool monospace;
  final void Function(String) onChanged;

  const _TextAnswer({
    required this.controller,
    required this.hint,
    required this.maxLines,
    this.monospace = false,
    required this.onChanged,
  });

  @override
  Widget build(
    BuildContext context,
  ) {
    final isDark =
        Theme.of(context).brightness ==
            Brightness.dark;

    return TextField(
      controller: controller,
      maxLines: maxLines,
      onChanged: onChanged,
      style: TextStyle(
        fontSize: 15,
        fontFamily:
            monospace
                ? 'monospace'
                : null,
        color: isDark
            ? AppTheme
                .darkTextPrimary
            : AppTheme
                .textPrimary,
      ),
      decoration:
          InputDecoration(
        hintText: hint,
        filled: true,
        fillColor: isDark
            ? AppTheme.darkSurface
            : AppTheme.surfaceCard,
        border:
            OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(
            14,
          ),
          borderSide:
              BorderSide(
            color: isDark
                ? AppTheme.darkBorder
                : AppTheme.border,
          ),
        ),
        enabledBorder:
            OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(
            14,
          ),
          borderSide:
              BorderSide(
            color: isDark
                ? AppTheme.darkBorder
                : AppTheme.border,
          ),
        ),
        focusedBorder:
            OutlineInputBorder(
          borderRadius:
              BorderRadius.circular(
            14,
          ),
          borderSide:
              const BorderSide(
            color:
                AppTheme.primary,
            width: 2,
          ),
        ),
        contentPadding:
            const EdgeInsets.all(
          16,
        ),
      ),
    );
  }
}

class _RatingAnswer
    extends StatelessWidget {
  final int rating;
  final int max;
  final void Function(int) onRate;

  const _RatingAnswer({
    required this.rating,
    required this.max,
    required this.onRate,
  });

  @override
  Widget build(
    BuildContext context,
  ) {
    final l10n =
        AppLocalizations.of(context);

    return Column(
      crossAxisAlignment:
          CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 6,
          children:
              List.generate(
            max,
            (i) {
              final filled =
                  i < rating;

              return GestureDetector(
                onTap: () =>
                    onRate(i + 1),
                child:
                    AnimatedContainer(
                  duration:
                      const Duration(
                    milliseconds:
                        150,
                  ),
                  child: Icon(
                    filled
                        ? Icons
                            .star_rounded
                        : Icons
                            .star_outline_rounded,
                    size:
                        filled
                            ? 40
                            : 34,
                    color: filled
                        ? AppTheme
                            .warning
                        : AppTheme
                            .textMuted,
                  ),
                ),
              );
            },
          ),
        ),

        const SizedBox(
          height: 8,
        ),

        Text(
          rating == 0
              ? l10n.notSelected
              : l10n.outOfStars(max, rating),
          style: TextStyle(
            fontSize: 13,
            color: rating == 0
                ? AppTheme
                    .textMuted
                : AppTheme
                    .warning,
            fontWeight:
                FontWeight.w500,
          ),
        ),
      ],
    );
  }
}

class _YesNoAnswer
    extends StatelessWidget {
  final String? value;
  final void Function(bool) onSelect;

  const _YesNoAnswer({
    required this.value,
    required this.onSelect,
  });

  @override
  Widget build(
    BuildContext context,
  ) {
    final l10n =
        AppLocalizations.of(context);

    return Row(
      children: [
        Expanded(
          child: _YNOption(
            label: l10n.yes,
            icon:
                Icons.check_circle_rounded,
            color:
                AppTheme.success,
            selected:
                value == 'yes' || value == 'Yes',
            onTap: () =>
                onSelect(true),
          ),
        ),

        const SizedBox(
          width: 12,
        ),

        Expanded(
          child: _YNOption(
            label: l10n.no,
            icon:
                Icons.cancel_rounded,
            color:
                AppTheme.error,
            selected:
                value == 'no' || value == 'No',
            onTap: () =>
                onSelect(false),
          ),
        ),
      ],
    );
  }
}

class _YNOption
    extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final bool selected;
  final VoidCallback onTap;

  const _YNOption({
    required this.label,
    required this.icon,
    required this.color,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(
    BuildContext context,
  ) {
    final isDark =
        Theme.of(context).brightness ==
            Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child:
          AnimatedContainer(
        duration:
            const Duration(
          milliseconds: 200,
        ),
        height: 68,
        decoration:
            BoxDecoration(
          color: selected
              ? color.withValues(
                  alpha: 0.10,
                )
              : Colors.transparent,
          borderRadius:
              BorderRadius.circular(
            16,
          ),
          border:
              Border.all(
            color: selected
                ? color
                : (isDark
                    ? AppTheme
                        .darkBorder
                    : AppTheme
                        .border),
            width:
                selected ? 2 : 1,
          ),
        ),
        child: Center(
          child: Row(
            mainAxisSize:
                MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 22,
                color: selected
                    ? color
                    : AppTheme
                        .textMuted,
              ),
              const SizedBox(
                width: 8,
              ),
              Text(
                label,
                style:
                    TextStyle(
                  fontSize: 16,
                  fontWeight:
                      FontWeight.w700,
                  color: selected
                      ? color
                      : AppTheme
                          .textMuted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MatchingAnswer extends StatefulWidget {
  final QuestionModel question;
  final Map<String, String> currentAnswers;
  final bool isDark;
  final void Function(Map<String, String>) onChanged;

  const _MatchingAnswer({
    required this.question,
    required this.currentAnswers,
    required this.isDark,
    required this.onChanged,
  });

  @override
  State<_MatchingAnswer> createState() => _MatchingAnswerState();
}

class _MatchingAnswerState extends State<_MatchingAnswer> {
  late Map<String, String> _selected;
  late List<String> _shuffledRights;

  @override
  void initState() {
    super.initState();
    _selected = Map<String, String>.from(widget.currentAnswers);
    _shuffledRights =
        widget.question.matchingPairs.map((p) => p.right).toList()..shuffle();
  }

  void _pick(String pairId, String? value) {
    setState(() {
      if (value == null) {
        _selected.remove(pairId);
      } else {
        _selected[pairId] = value;
      }
    });
    widget.onChanged(Map<String, String>.from(_selected));
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final pairs = widget.question.matchingPairs;

    if (pairs.isEmpty) {
      return const SizedBox.shrink();
    }

    final cardColor =
        widget.isDark ? AppTheme.darkCard : AppTheme.surfaceCard;
    final borderColor =
        widget.isDark ? AppTheme.darkBorder : AppTheme.border;
    final textColor = widget.isDark
        ? AppTheme.darkTextPrimary
        : AppTheme.textPrimary;
    final mutedColor =
        widget.isDark ? AppTheme.darkTextMuted : AppTheme.textMuted;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    l10n.leftCol,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.primary,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.info.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    l10n.choosePair,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.info,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),

        ...pairs.map((pair) {
          final picked = _selected[pair.id];
          final isAnswered = picked != null && picked.isNotEmpty;

          return Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isAnswered
                    ? AppTheme.success.withValues(alpha: 0.35)
                    : borderColor,
                width: isAnswered ? 1.5 : 1,
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    pair.left,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: textColor,
                    ),
                  ),
                ),
                Icon(Icons.arrow_forward_rounded,
                    size: 16, color: mutedColor),
                const SizedBox(width: 6),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    decoration: BoxDecoration(
                      color: isAnswered
                          ? AppTheme.success.withValues(alpha: 0.06)
                          : (widget.isDark
                              ? AppTheme.darkSurface
                              : AppTheme.surfaceLight),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: isAnswered
                            ? AppTheme.success.withValues(alpha: 0.35)
                            : borderColor,
                      ),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: picked,
                        isExpanded: true,
                        isDense: true,
                        hint: Text(
                          l10n.pick,
                          style: TextStyle(
                              fontSize: 13, color: mutedColor),
                        ),
                        style: TextStyle(
                          fontSize: 13,
                          color: textColor,
                          fontWeight: FontWeight.w500,
                        ),
                        items: [
                          DropdownMenuItem<String>(
                            value: null,
                            child: Text(
                              l10n.clearChoice,
                              style: TextStyle(
                                  fontSize: 12, color: mutedColor),
                            ),
                          ),
                          ..._shuffledRights.map(
                            (r) => DropdownMenuItem<String>(
                              value: r,
                              child: Text(r,
                                  overflow: TextOverflow.ellipsis),
                            ),
                          ),
                        ],
                        onChanged: (v) => _pick(pair.id, v),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}

class _LegendDot extends StatelessWidget {
  final Color color;
  final String label;
  final bool current;
  final bool outlined;
  const _LegendDot({
    required this.color,
    required this.label,
    this.current = false,
    this.outlined = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(mainAxisSize: MainAxisSize.min, children: [
      Container(
        width: 14,
        height: 14,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: outlined ? Colors.transparent : color,
          border: Border.all(
            color: outlined ? color : Colors.transparent,
            width: 1.5,
          ),
        ),
        child: current
            ? Center(
                child: Container(
                  width: 5,
                  height: 5,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                ),
              )
            : null,
      ),
      const SizedBox(width: 5),
      Text(label,
          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500)),
    ]);
  }
}

class _SummaryLine extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String text;
  const _SummaryLine({
    required this.icon,
    required this.color,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 6),
        Text(
          text,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: color,
          ),
        ),
      ],
    );
  }
}
