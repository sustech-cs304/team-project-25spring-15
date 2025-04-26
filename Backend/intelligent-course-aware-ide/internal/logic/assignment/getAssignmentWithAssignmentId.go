package assignment

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (a *Assignments) GetAssignmentWithAssignmentId(ctx context.Context, assignmentId int64) (assignmentFound *entity.Assignments, err error) {
	err = dao.Assignments.Ctx(ctx).WherePri(assignmentId).Scan(&assignmentFound)
	return assignmentFound, err
}
