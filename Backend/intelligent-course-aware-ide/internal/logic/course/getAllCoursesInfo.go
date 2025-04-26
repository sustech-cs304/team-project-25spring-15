package course

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *Courses) GetAllCoursesInfo(ctx context.Context) (courses []*entity.Courses, err error) {
	err = dao.Courses.Ctx(ctx).Scan(&courses)
	return courses, err
}
