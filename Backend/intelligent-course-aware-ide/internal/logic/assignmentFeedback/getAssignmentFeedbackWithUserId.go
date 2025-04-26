package assignmentfeeback

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (a *Assignmentfeebacks) GetAssignmentFeedbackWithUserId(ctx context.Context, userId int64) (assignmentfeebacks []*entity.AssignmentUserFeedback, err error) {
	err = dao.AssignmentUserFeedback.Ctx(ctx).Where("performerId", userId).Scan(&assignmentfeebacks)
	return assignmentfeebacks, err
}
