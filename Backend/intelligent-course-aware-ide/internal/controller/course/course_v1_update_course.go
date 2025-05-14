package course

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/utility"
)

func (c *ControllerV1) UpdateCourse(ctx context.Context, req *v1.UpdateCourseReq) (res *v1.UpdateCourseRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
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
		info := utility.ConstructInfo(req.UpdateCourse, 1, -1)
		_, err = dao.Courses.Ctx(ctx).Data(info).WherePri(req.UpdateCourse.CourseId).Update()
		if err != nil {
			return res, err
		}

		operatorName := ctx.Value("operatorName").(string)
		systemInfo := operatorName + "update course:" + req.UpdateCourse.CourseName
		success, err := c.chats.SendSystemMessage(ctx, systemInfo, req.UpdateCourse.ChatId)
		if !success || err != nil {
			return res, errors.New("fail to send message")
		}
		res.Success = true
		return res, err
	}

	return res, errors.New("please check whether you are teacher or assistant of this course")
}
