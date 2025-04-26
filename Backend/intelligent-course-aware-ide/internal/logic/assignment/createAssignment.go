package assignment

import (
	"context"
	assignmentv1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (a *Assignments) CreateAssignment(ctx context.Context, NewAssignment *assignmentv1.AssignmentInfo) (assignmentId int64, err error) {
	assignmentId, err = dao.Assignments.Ctx(ctx).Data(NewAssignment).InsertAndGetId()
	return assignmentId, err
}
