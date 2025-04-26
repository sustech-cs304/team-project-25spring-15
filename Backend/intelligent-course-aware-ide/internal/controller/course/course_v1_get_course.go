package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
)

func (c *ControllerV1) GetCourse(ctx context.Context, req *v1.GetCourseReq) (res *v1.GetCourseRes, err error) {
	res = &v1.GetCourseRes{}
	res.Course, err = c.courses.GetCourseWithCourseId(ctx, req.CourseId)
	return res, err
}
