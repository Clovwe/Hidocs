package repository

import (
	"context"
	"errors"

	"backend/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type responseRepository struct {
	db *gorm.DB
}

func NewResponseRepository(db *gorm.DB) domain.ResponseRepository {
	return &responseRepository{db: db}
}

func (r *responseRepository) CreateResponse(ctx context.Context, resp *domain.FormResponse) error {
	return r.db.WithContext(ctx).Create(resp).Error
}

func (r *responseRepository) GetResponseByID(ctx context.Context, id uuid.UUID) (*domain.FormResponse, error) {
	var resp domain.FormResponse
	err := r.db.WithContext(ctx).
		Preload("Form").
		Preload("Answers").
		Preload("Answers.Question").
		Preload("Answers.Question.Options").
		Preload("Answers.SelectedOption").
		First(&resp, "id = ?", id).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrResponseNotFound
		}
		return nil, err
	}
	return &resp, nil
}

func (r *responseRepository) GetResponsesByFormID(ctx context.Context, formID uuid.UUID) ([]domain.FormResponse, error) {
	var responses []domain.FormResponse
	err := r.db.WithContext(ctx).
		Preload("Answers").
		Preload("Answers.SelectedOption").
		Where("form_id = ?", formID).
		Order("submitted_at desc").
		Find(&responses).Error

	return responses, err
}

func (r *responseRepository) GetResponsesByEmail(ctx context.Context, email string) ([]domain.FormResponse, error) {
	var responses []domain.FormResponse
	err := r.db.WithContext(ctx).
		Preload("Form").
		Preload("Answers").
		Preload("Answers.Question").
		Preload("Answers.SelectedOption").
		Where("respondent_email = ?", email).
		Order("submitted_at desc").
		Find(&responses).Error

	return responses, err
}

func (r *responseRepository) GetActiveResponseSession(ctx context.Context, formID uuid.UUID, email string) (*domain.FormResponse, error) {
	var resp domain.FormResponse
	err := r.db.WithContext(ctx).
		Preload("Answers").
		Where("form_id = ? AND respondent_email = ? AND status IN ?", formID, email, []domain.ResponseStatus{domain.ResponseStatusInProgress, domain.ResponseStatusRestarted}).
		Order("started_at desc").
		First(&resp).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &resp, nil
}

func (r *responseRepository) CheckUserAlreadySubmitted(ctx context.Context, formID uuid.UUID, email string) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&domain.FormResponse{}).
		Where("form_id = ? AND respondent_email = ? AND status = ?", formID, email, domain.ResponseStatusSubmitted).
		Count(&count).Error

	return count > 0, err
}

func (r *responseRepository) UpdateResponseGrade(ctx context.Context, responseID uuid.UUID, totalScore float64) error {
	return r.db.WithContext(ctx).
		Model(&domain.FormResponse{}).
		Where("id = ?", responseID).
		Update("total_score", totalScore).Error
}

func (r *responseRepository) UpdateResponseStatus(ctx context.Context, responseID uuid.UUID, status domain.ResponseStatus) error {
	return r.db.WithContext(ctx).
		Model(&domain.FormResponse{}).
		Where("id = ?", responseID).
		Update("status", status).Error
}

func (r *responseRepository) UpsertAnswer(ctx context.Context, answer *domain.ResponseAnswer) error {
	return r.db.WithContext(ctx).
		Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "response_id"}, {Name: "question_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"selected_option_id", "answer_text", "is_flagged", "match_pair_json"}),
		}).Create(answer).Error
}

func (r *responseRepository) UpdateTelemetry(ctx context.Context, responseID uuid.UUID, eventType string, eventMessage *string, currentQuestionIdx int, metadata *string) error {
	// 1. Create log record
	log := &domain.ProctoringLog{
		ID:           uuid.New(),
		ResponseID:   responseID,
		EventType:    eventType,
		EventMessage: eventMessage,
		Metadata:     metadata,
	}
	_ = r.db.WithContext(ctx).Create(log).Error

	// 2. Increment violation counters on FormResponse
	updates := map[string]interface{}{
		"last_heartbeat": gorm.Expr("NOW()"),
	}
	if currentQuestionIdx > 0 {
		updates["current_question_index"] = currentQuestionIdx
	}

	switch eventType {
	case "TAB_SWITCH", "APP_BACKGROUNDED":
		updates["tab_switch_count"] = gorm.Expr("tab_switch_count + 1")
	case "WINDOW_BLUR", "FULLSCREEN_EXIT", "SPLIT_SCREEN", "FLOATING_WINDOW":
		updates["blur_count"] = gorm.Expr("blur_count + 1")
	}

	return r.db.WithContext(ctx).Model(&domain.FormResponse{}).Where("id = ?", responseID).Updates(updates).Error
}

func (r *responseRepository) GetLiveMonitoringByFormID(ctx context.Context, formID uuid.UUID) ([]domain.LiveMonitoringStudent, error) {
	var responses []domain.FormResponse
	err := r.db.WithContext(ctx).
		Preload("Answers").
		Where("form_id = ?", formID).
		Order("last_heartbeat desc").
		Find(&responses).Error

	if err != nil {
		return nil, err
	}

	var totalQuestions int64
	r.db.WithContext(ctx).Model(&domain.Question{}).Where("form_id = ?", formID).Count(&totalQuestions)

	results := make([]domain.LiveMonitoringStudent, 0, len(responses))
	for _, resp := range responses {
		answeredCount := 0
		flaggedCount := 0
		for _, a := range resp.Answers {
			if a.SelectedOptionID != nil || a.AnswerText != "" || (a.MatchPairJSON != nil && *a.MatchPairJSON != "") {
				answeredCount++
			}
			if a.IsFlagged {
				flaggedCount++
			}
		}

		isSuspicious := resp.TabSwitchCount >= 2 || resp.BlurCount >= 3

		results = append(results, domain.LiveMonitoringStudent{
			ResponseID:           resp.ID,
			RespondentEmail:      resp.RespondentEmail,
			Status:               resp.Status,
			CurrentQuestionIndex: resp.CurrentQuestionIndex,
			TotalQuestions:       int(totalQuestions),
			AnsweredCount:        answeredCount,
			FlaggedCount:         flaggedCount,
			TabSwitchCount:       resp.TabSwitchCount,
			BlurCount:            resp.BlurCount,
			DevicePlatform:       resp.DevicePlatform,
			WarningMessage:       resp.WarningMessage,
			StartedAt:            resp.StartedAt,
			LastHeartbeat:        resp.LastHeartbeat,
			IsSuspicious:         isSuspicious,
		})
	}

	return results, nil
}

func (r *responseRepository) RestartStudentResponse(ctx context.Context, responseID uuid.UUID, warningMsg string) error {
	// Reset draft answers and set status to RESTARTED with the warning message
	_ = r.db.WithContext(ctx).Where("response_id = ?", responseID).Delete(&domain.ResponseAnswer{}).Error

	return r.db.WithContext(ctx).Model(&domain.FormResponse{}).
		Where("id = ?", responseID).
		Updates(map[string]interface{}{
			"status":                   domain.ResponseStatusRestarted,
			"warning_message":          warningMsg,
			"is_warning_acknowledged":  false,
			"current_question_index":   1,
			"last_heartbeat":           gorm.Expr("NOW()"),
		}).Error
}

func (r *responseRepository) AcknowledgeWarning(ctx context.Context, responseID uuid.UUID) error {
	return r.db.WithContext(ctx).Model(&domain.FormResponse{}).
		Where("id = ?", responseID).
		Updates(map[string]interface{}{
			"is_warning_acknowledged": true,
			"status":                  domain.ResponseStatusInProgress,
		}).Error
}

func (r *responseRepository) GetAnalyticsByFormID(ctx context.Context, formID uuid.UUID) (*domain.FormAnalytics, error) {
	var responses []domain.FormResponse
	err := r.db.WithContext(ctx).
		Preload("Answers").
		Where("form_id = ?", formID).
		Find(&responses).Error

	if err != nil {
		return nil, err
	}

	analytics := &domain.FormAnalytics{
		TotalResponses:    int64(len(responses)),
		QuestionBreakdown: make(map[uuid.UUID]domain.QuestionAnalytics),
	}

	if len(responses) == 0 {
		return analytics, nil
	}

	var sumScore float64
	var countWithScore float64
	var highest float64
	var lowest float64
	first := true

	for _, resp := range responses {
		if resp.TotalScore != nil {
			score := *resp.TotalScore
			sumScore += score
			countWithScore++

			if first {
				highest = score
				lowest = score
				first = false
			} else {
				if score > highest {
					highest = score
				}
				if score < lowest {
					lowest = score
				}
			}
		}
	}

	if countWithScore > 0 {
		analytics.AverageScore = sumScore / countWithScore
		analytics.HighestScore = highest
		analytics.LowestScore = lowest
	}

	// Fetch all questions for this form
	var questions []domain.Question
	r.db.WithContext(ctx).Preload("Options").Where("form_id = ?", formID).Find(&questions)

	for _, q := range questions {
		qAnalytics := domain.QuestionAnalytics{
			QuestionID:   q.ID,
			QuestionText: q.QuestionText,
			OptionCounts: make(map[string]int),
		}

		for _, opt := range q.Options {
			qAnalytics.OptionCounts[opt.ID.String()] = 0
		}

		var totalAns int64
		var correctAns int64

		for _, resp := range responses {
			for _, ans := range resp.Answers {
				if ans.QuestionID == q.ID {
					totalAns++
					if ans.SelectedOptionID != nil {
						optIDStr := ans.SelectedOptionID.String()
						qAnalytics.OptionCounts[optIDStr]++

						// Check if selected option was correct
						for _, opt := range q.Options {
							if opt.ID == *ans.SelectedOptionID && opt.IsCorrect {
								correctAns++
								break
							}
						}
					}
				}
			}
		}

		qAnalytics.TotalAnswered = totalAns
		qAnalytics.CorrectCount = correctAns
		if totalAns > 0 {
			qAnalytics.AccuracyRate = (float64(correctAns) / float64(totalAns)) * 100.0
		}

		analytics.QuestionBreakdown[q.ID] = qAnalytics
	}

	return analytics, nil
}
