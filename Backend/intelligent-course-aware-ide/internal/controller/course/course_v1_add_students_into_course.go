package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
	"intelligent-course-aware-ide/internal/model/entity"
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
		for _, studentEmail := range req.StudentsEmail {
			var student *entity.Users
			err = dao.Users.Ctx(ctx).Where("email", studentEmail).Scan(&student)
			if err != nil {
				return res, err
			}
			_, err = dao.UserCourseInfo.Ctx(ctx).Data(do.UserCourseInfo{
				UserId:   student.UserId,
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
