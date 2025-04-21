package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) UpdateCourse(ctx context.Context, req *v1.UpdateCourseReq) (res *v1.UpdateCourseRes, err error) {
	_, err = dao.Courses.Ctx(ctx).Data(do.Courses{
		CourseName:  req.UpdateCourse.CourseName,
		Description: req.UpdateCourse.Description,
		StartTime:   req.UpdateCourse.StartTime,
		EndTime:     req.UpdateCourse.EndTime,
	}).WherePri(req.UpdateCourse.CourseId).Update()
	res = &v1.UpdateCourseRes{
		Success: false,
	}
	if err != nil {
		return res, err
	}
	res.Success = true
	return res, err
}
