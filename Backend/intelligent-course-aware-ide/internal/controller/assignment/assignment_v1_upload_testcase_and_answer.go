package assignment

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) UploadTestcaseAndAnswer(ctx context.Context, req *v1.UploadTestcaseAndAnswerReq) (res *v1.UploadTestcaseAndAnswerRes, err error) {
	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, req.TestcaseAndAnswer.PublisherId, req.CourseId)
	if err != nil {
		return nil, err
	}
	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, req.TestcaseAndAnswer.PublisherId, req.CourseId)
	if err != nil {
		return nil, err
	}

	if result1 || result2 {
		testcaseAndAnswerId, err := dao.TestcaseAndAnswerFiles.Ctx(ctx).Data(req.TestcaseAndAnswer).InsertAndGetId()
		if err != nil {
			return nil, err
		}

		res = &v1.UploadTestcaseAndAnswerRes{
			TestcaseAndAnswerId: testcaseAndAnswerId,
		}
		return res, err
	}
	return nil, errors.New("please check whether you have the permission to upload testcase")
}
