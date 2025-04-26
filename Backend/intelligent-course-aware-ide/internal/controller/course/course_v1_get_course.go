package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetCourse(ctx context.Context, req *v1.GetCourseReq) (res *v1.GetCourseRes, err error) {
	res = &v1.GetCourseRes{}
	err = dao.Courses.Ctx(ctx).WherePri(req.CourseId).Scan(&res.Course)
	return res, err
}
