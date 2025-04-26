package assignment

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (a *Assignments) GetAllAssignmentsWithCourseId(ctx context.Context, courseId int64) (assignments []*entity.Assignments, err error) {
	err = dao.Assignments.Ctx(ctx).Where("courseId", courseId).Scan(&assignments)
	return assignments, err
}
