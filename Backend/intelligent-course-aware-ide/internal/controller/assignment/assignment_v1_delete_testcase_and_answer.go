package assignment

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/controller/course"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteTestcaseAndAnswer(ctx context.Context, req *v1.DeleteTestcaseAndAnswerReq) (res *v1.DeleteTestcaseAndAnswerRes, err error) {

	result1, err := course.CheckUserHasFullPermission(ctx, req.UserId, req.CourseId)
	if err != nil {
		return nil, err
	}
	result2, err := course.CheckUserHasHalfPermission(ctx, req.UserId, req.CourseId)
	if err != nil {
		return nil, err
	}

	if result1 || result2 {
		_, err := dao.TestcaseAndAnswerFiles.Ctx(ctx).WherePri(req.TestcaseAndAnswerId).Delete()
		if err != nil {
			return nil, err
		}

		res = &v1.DeleteTestcaseAndAnswerRes{
			Success: true,
		}
		return res, err
	}
	return nil, errors.New("please check whether you have the permission to delete testcase")
}
