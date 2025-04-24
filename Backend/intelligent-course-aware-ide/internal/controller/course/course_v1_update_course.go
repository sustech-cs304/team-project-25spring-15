package course

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/controller/user"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) UpdateCourse(ctx context.Context, req *v1.UpdateCourseReq) (res *v1.UpdateCourseRes, err error) {
	res = &v1.UpdateCourseRes{
		Success: false,
	}

	result1, err := CheckUserHasFullPermission(ctx, req.UserId, req.UpdateCourse.CourseId)
	if err != nil {
		return res, err
	}
	result2, err := CheckUserHasHalfPermission(ctx, req.UserId, req.UpdateCourse.CourseId)
	if err != nil {
		return res, err
	}

	if result1 || result2 {
		info := user.ConstructInfo(req.UpdateCourse)
		_, err = dao.Courses.Ctx(ctx).Data(info).WherePri(req.UpdateCourse.CourseId).Update()
		if err != nil {
			return res, err
		}
		res.Success = true
		return res, err
	}

	return res, errors.New("please check whether you are teacher or assistant of this course")
}
