package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
)

func (c *ControllerV1) GetAllCoursesInfo(ctx context.Context, req *v1.GetAllCoursesInfoReq) (res *v1.GetAllCoursesInfoRes, err error) {
	res = &v1.GetAllCoursesInfoRes{}
	res.Courses, err = c.courses.GetAllCoursesInfo(ctx)
	return res, err
}
