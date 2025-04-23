package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/controller/user"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) UpdateCourse(ctx context.Context, req *v1.UpdateCourseReq) (res *v1.UpdateCourseRes, err error) {
	info := user.ConstructInfo(req.UpdateCourse)
	_, err = dao.Courses.Ctx(ctx).Data(info).WherePri(req.UpdateCourse.CourseId).Update()
	res = &v1.UpdateCourseRes{
		Success: false,
	}
	if err != nil {
		return res, err
	}
	res.Success = true
	return res, err
}
