package course

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/frame/g"
)

func (c *Courses) UpdateCourse(ctx context.Context, courseInfo g.Map, courseId int64) error {
	_, err := dao.Courses.Ctx(ctx).Data(courseInfo).WherePri(courseId).Update()
	return err
}
