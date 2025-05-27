package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) AddStudentsIntoCourse(ctx context.Context, req *v1.AddStudentsIntoCourseReq) (res *v1.AddStudentsIntoCourseRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.AddStudentsIntoCourseRes{
		Success: false,
	}
	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return nil, err
	}

	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return nil, err
	}
	if result1 || result2 {
		for _, studentId := range req.StudentsId {
			_, err = dao.UserCourseInfo.Ctx(ctx).Data(do.UserCourseInfo{
				UserId:   studentId,
				CourseId: req.CourseId,
			}).Insert()
			if err != nil {
				return res, err
			}
		}
	}
	res.Success = true
	return res, nil
}
