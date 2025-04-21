package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) CreateCourse(ctx context.Context, req *v1.CreateCourseReq) (res *v1.CreateCourseRes, err error) {
	courseId, err := dao.Courses.Ctx(ctx).Data(do.Courses{
		TeacherId:   req.NewCourse.TeacherId,
		CourseName:  req.NewCourse.CourseName,
		Description: req.NewCourse.Description,
		StartTime:   req.NewCourse.StartTime,
		EndTime:     req.NewCourse.EndTime,
	}).InsertAndGetId()

	if err != nil {
		return nil, err
	}

	res = &v1.CreateCourseRes{
		CourseId: courseId,
	}

	return res, nil
}
