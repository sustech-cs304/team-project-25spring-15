package course

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *Courses) GetCourseWithCourseId(ctx context.Context, courseId int64) (course *entity.Courses, err error) {
	err = dao.Courses.Ctx(ctx).WherePri(courseId).Scan(&course)
	return course, err
}
