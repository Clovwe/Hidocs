package service

import (
	"context"
	"runtime"
	"sync"

	"backend/internal/application/dto"
	"backend/internal/domain"
	"backend/internal/infrastructure/security"
	"github.com/google/uuid"
)

type UserService interface {
	GetProfile(ctx context.Context, userID uuid.UUID) (*dto.UserResponse, error)
	UpdateProfile(ctx context.Context, userID uuid.UUID, req dto.UpdateProfileRequest) (*dto.UserResponse, error)
	ImportStudents(ctx context.Context, req dto.ImportStudentsRequest) (int, error)
}

type userService struct {
	userRepo       domain.UserRepository
	passwordHasher security.PasswordHasher
}

func NewUserService(userRepo domain.UserRepository, hasher security.PasswordHasher) UserService {
	return &userService{
		userRepo:       userRepo,
		passwordHasher: hasher,
	}
}

func (s *userService) GetProfile(ctx context.Context, userID uuid.UUID) (*dto.UserResponse, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &dto.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      user.Role,
		AvatarURL: user.AvatarURL,
		IsActive:  user.IsActive,
		CreatedAt: user.CreatedAt,
	}, nil
}

func (s *userService) UpdateProfile(ctx context.Context, userID uuid.UUID, req dto.UpdateProfileRequest) (*dto.UserResponse, error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	user.Name = req.Name
	if req.AvatarURL != "" {
		user.AvatarURL = req.AvatarURL
	}

	if err := s.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}

	return &dto.UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      user.Role,
		AvatarURL: user.AvatarURL,
		IsActive:  user.IsActive,
		CreatedAt: user.CreatedAt,
	}, nil
}

func (s *userService) ImportStudents(ctx context.Context, req dto.ImportStudentsRequest) (int, error) {
	if len(req.Students) == 0 {
		return 0, nil
	}

	// 1. Gather all unique incoming emails
	emails := make([]string, 0, len(req.Students))
	seenInBatch := make(map[string]bool, len(req.Students))
	uniqueReqs := make([]dto.RegisterRequest, 0, len(req.Students))

	for _, st := range req.Students {
		if st.Email == "" || seenInBatch[st.Email] {
			continue
		}
		seenInBatch[st.Email] = true
		emails = append(emails, st.Email)
		uniqueReqs = append(uniqueReqs, st)
	}

	// 2. Query DB once to filter out existing users
	existingEmails, err := s.userRepo.GetExistingEmails(ctx, emails)
	if err != nil {
		return 0, err
	}

	toProcess := make([]dto.RegisterRequest, 0, len(uniqueReqs))
	for _, st := range uniqueReqs {
		if !existingEmails[st.Email] {
			toProcess = append(toProcess, st)
		}
	}

	if len(toProcess) == 0 {
		return 0, nil
	}

	// 3. Parallel bcrypt password hashing via worker pool
	numWorkers := runtime.NumCPU() * 2
	if numWorkers < 4 {
		numWorkers = 4
	}
	if numWorkers > len(toProcess) {
		numWorkers = len(toProcess)
	}

	type hashTask struct {
		student dto.RegisterRequest
	}
	type hashResult struct {
		user *domain.User
		err  error
	}

	tasks := make(chan hashTask, len(toProcess))
	results := make(chan hashResult, len(toProcess))

	var wg sync.WaitGroup
	for w := 0; w < numWorkers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for task := range tasks {
				hash, err := s.passwordHasher.HashPassword(task.student.Password)
				if err != nil {
					results <- hashResult{err: err}
					continue
				}
				results <- hashResult{
					user: &domain.User{
						ID:           uuid.New(),
						Name:         task.student.Name,
						Email:        task.student.Email,
						PasswordHash: hash,
						Role:         domain.RoleUser,
						IsActive:     true,
					},
				}
			}
		}()
	}

	for _, item := range toProcess {
		tasks <- hashTask{student: item}
	}
	close(tasks)

	wg.Wait()
	close(results)

	var usersToInsert []domain.User
	for res := range results {
		if res.err == nil && res.user != nil {
			usersToInsert = append(usersToInsert, *res.user)
		}
	}

	if len(usersToInsert) == 0 {
		return 0, nil
	}

	// 4. Batch DB insert
	if err := s.userRepo.CreateBatch(ctx, usersToInsert); err != nil {
		return 0, err
	}

	return len(usersToInsert), nil
}
