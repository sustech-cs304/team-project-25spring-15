package assignment

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
)

func (a *Assignments) DeleteAssignment(ctx context.Context, assignmentId int64) error {
	_, err := dao.Assignments.Ctx(ctx).WherePri(assignmentId).Delete()
	return err
}
