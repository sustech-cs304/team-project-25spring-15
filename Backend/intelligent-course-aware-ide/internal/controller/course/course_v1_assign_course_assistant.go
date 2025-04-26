package course

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) AssignCourseAssistant(ctx context.Context, req *v1.AssignCourseAssistantReq) (res *v1.AssignCourseAssistantRes, err error) {
	result, err := CheckUserHasFullPermissionOfCourse(ctx, req.UserId, req.CourseId)
	if err != nil {
		return nil, err
	}

	if result {
		res = &v1.AssignCourseAssistantRes{
			Success: false,
		}
		_, err = dao.CourseAssistants.Ctx(ctx).Data(do.CourseAssistants{
			CourseId:    req.CourseId,
			AssistantId: req.AssistantId,
		}).Insert()
		if err != nil {
			return res, err
		}
		res.Success = true
		return res, err
	}
	return nil, errors.New("please check whether you have permission to assign course assistant")
}
