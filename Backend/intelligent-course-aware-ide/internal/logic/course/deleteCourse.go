package course

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *Courses) DeleteCourse(ctx context.Context, courseId int64) error {
	_, err := dao.Courses.Ctx(ctx).WherePri(courseId).Delete()
	return err
}
