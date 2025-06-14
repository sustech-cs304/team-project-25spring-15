package assignment

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteTestcaseAndAnswer(ctx context.Context, req *v1.DeleteTestcaseAndAnswerReq) (res *v1.DeleteTestcaseAndAnswerRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return nil, err
	}
	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return nil, err
	}

	if result1 || result2 {
		_, err = dao.TestcaseAndAnswerFiles.Ctx(ctx).WherePri(req.TestcaseAndAnswerId).Delete()
		if err != nil {
			return nil, err
		}

		operatorName := ctx.Value("operatorName").(string)
		systemInfo := operatorName + "delete testcase for course:" + req.CourseName
		success, err := c.chats.SendSystemMessage(ctx, systemInfo, req.ChatId)
		if !success || err != nil {
			return nil, errors.New("fail to send message")
		}

		res = &v1.DeleteTestcaseAndAnswerRes{
			Success: true,
		}
		return res, err
	}
	return nil, errors.New("please check whether you have the permission to delete testcase")
}
