package course

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/utility"
)

func (c *ControllerV1) UpdateCourse(ctx context.Context, req *v1.UpdateCourseReq) (res *v1.UpdateCourseRes, err error) {
	operatorId, err := c.logins.GetOperatorIdFromJWT(ctx)
	if err != nil {
		return nil, err
	}
	res = &v1.UpdateCourseRes{
		Success: false,
	}

	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, operatorId, req.UpdateCourse.CourseId)
	if err != nil {
		return res, err
	}
	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, operatorId, req.UpdateCourse.CourseId)
	if err != nil {
		return res, err
	}

	if result1 || result2 {
		info := utility.ConstructInfo(req.UpdateCourse, 1)
		_, err = dao.Courses.Ctx(ctx).Data(info).WherePri(req.UpdateCourse.CourseId).Update()
		if err != nil {
			return res, err
		}
		res.Success = true
		return res, err
	}

	return res, errors.New("please check whether you are teacher or assistant of this course")
}
