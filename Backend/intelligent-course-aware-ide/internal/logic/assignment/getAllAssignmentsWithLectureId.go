package assignment

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (a *Assignments) GetAllAssignmentsWithLectureId(ctx context.Context, lectureId int64) (assignments []*entity.Assignments, err error) {
	err = dao.Assignments.Ctx(ctx).Where("lectureId", lectureId).Scan(&assignments)
	return assignments, err
}
