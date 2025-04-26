package course

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/course/v1"
)

func (c *ControllerV1) CreateCourse(ctx context.Context, req *v1.CreateCourseReq) (res *v1.CreateCourseRes, err error) {
	if c.users.CheckUserIsStudent(ctx, req.UserId) {
		return nil, errors.New("please check whether you are superuser or teacher")
	}

	courseId, err := c.courses.CreateCourse(ctx, &req.NewCourse)
	if err != nil {
		return nil, err
	}

	res = &v1.CreateCourseRes{
		CourseId: courseId,
	}
	return res, nil
}
