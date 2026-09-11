package domain

import (
	"time"

	"github.com/google/uuid"
)

type ResponseStatus string

const (
	ResponseStatusInProgress ResponseStatus = "IN_PROGRESS"
	ResponseStatusSubmitted  ResponseStatus = "SUBMITTED"
	ResponseStatusRestarted  ResponseStatus = "RESTARTED"
	ResponseStatusBlocked    ResponseStatus = "BLOCKED"
)

type FormResponse struct {
	ID                     uuid.UUID        `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	FormID                 uuid.UUID        `gorm:"type:uuid;not null;index" json:"form_id"`
	UserID                 *uuid.UUID       `gorm:"type:uuid;index" json:"user_id,omitempty"`
	RespondentEmail        string           `gorm:"type:varchar(100);not null" json:"respondent_email"`
	Status                 ResponseStatus   `gorm:"type:varchar(20);not null;default:'IN_PROGRESS';index" json:"status"`
	CurrentQuestionIndex   int              `gorm:"type:int;default:1" json:"current_question_index"`
	TabSwitchCount         int              `gorm:"type:int;default:0" json:"tab_switch_count"`
	BlurCount              int              `gorm:"type:int;default:0" json:"blur_count"`
	DevicePlatform         string           `gorm:"type:varchar(30);default:'WEB'" json:"device_platform"`
	WarningMessage         *string          `gorm:"type:text" json:"warning_message,omitempty"`
	IsWarningAcknowledged  bool             `gorm:"type:boolean;default:false" json:"is_warning_acknowledged"`
	IPAddress              *string          `gorm:"type:varchar(45)" json:"ip_address,omitempty"`
	UserAgent              *string          `gorm:"type:text" json:"user_agent,omitempty"`
	TotalScore             *float64         `gorm:"type:float" json:"total_score,omitempty"`
	IsAutoSubmitted        bool             `gorm:"type:boolean;default:false" json:"is_auto_submitted"`
	StartedAt              time.Time        `gorm:"type:timestamp;not null;default:now()" json:"started_at"`
	LastHeartbeat          time.Time        `gorm:"type:timestamp;not null;default:now()" json:"last_heartbeat"`
	SubmittedAt            time.Time        `gorm:"type:timestamp;not null;default:now()" json:"submitted_at"`
	
	// Relations
	Form                   *Form            `gorm:"foreignKey:FormID;constraint:OnDelete:CASCADE" json:"form,omitempty"`
	User                   *User            `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Answers                []ResponseAnswer `gorm:"foreignKey:ResponseID;constraint:OnDelete:CASCADE" json:"answers,omitempty"`
	ProctoringLogs         []ProctoringLog  `gorm:"foreignKey:ResponseID;constraint:OnDelete:CASCADE" json:"proctoring_logs,omitempty"`
}

type ResponseAnswer struct {
	ID               uuid.UUID       `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	ResponseID       uuid.UUID       `gorm:"type:uuid;not null;index;uniqueIndex:uq_resp_question" json:"response_id"`
	QuestionID       uuid.UUID       `gorm:"type:uuid;not null;index;uniqueIndex:uq_resp_question" json:"question_id"`
	SelectedOptionID *uuid.UUID      `gorm:"type:uuid" json:"selected_option_id,omitempty"`
	AnswerText       string          `gorm:"type:text" json:"answer_text,omitempty"`
	ScoreGiven       *float64        `gorm:"type:float" json:"score_given,omitempty"`
	IsFlagged        bool            `gorm:"type:boolean;default:false" json:"is_flagged"`
	MatchPairJSON    *string         `gorm:"type:jsonb" json:"match_pair_json,omitempty"`
	
	// Relations
	Question         *Question       `gorm:"foreignKey:QuestionID" json:"question,omitempty"`
	SelectedOption   *QuestionOption `gorm:"foreignKey:SelectedOptionID" json:"selected_option,omitempty"`
}

type ProctoringLog struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	ResponseID   uuid.UUID `gorm:"type:uuid;not null;index" json:"response_id"`
	EventType    string    `gorm:"type:varchar(50);not null;index" json:"event_type"`
	EventMessage *string   `gorm:"type:text" json:"event_message,omitempty"`
	Metadata     *string   `gorm:"type:jsonb" json:"metadata,omitempty"`
	CreatedAt    time.Time `gorm:"type:timestamp;not null;default:now()" json:"created_at"`
}

type LiveMonitoringStudent struct {
	ResponseID           uuid.UUID      `json:"response_id"`
	RespondentEmail      string         `json:"respondent_email"`
	Status               ResponseStatus `json:"status"`
	CurrentQuestionIndex int            `json:"current_question_index"`
	TotalQuestions       int            `json:"total_questions"`
	AnsweredCount        int            `json:"answered_count"`
	FlaggedCount         int            `json:"flagged_count"`
	TabSwitchCount       int            `json:"tab_switch_count"`
	BlurCount            int            `json:"blur_count"`
	DevicePlatform       string         `json:"device_platform"`
	WarningMessage       *string        `json:"warning_message,omitempty"`
	StartedAt            time.Time      `json:"started_at"`
	LastHeartbeat        time.Time      `json:"last_heartbeat"`
	IsSuspicious         bool           `json:"is_suspicious"`
}
