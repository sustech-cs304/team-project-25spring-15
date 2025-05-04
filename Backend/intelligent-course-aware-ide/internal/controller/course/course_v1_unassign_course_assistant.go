package course

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) UnassignCourseAssistant(ctx context.Context, req *v1.UnassignCourseAssistantReq) (res *v1.UnassignCourseAssistantRes, err error) {
	result, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, req.UserId, req.CourseId)
	if err != nil {
		return nil, err
	}
	if result || (req.AssistantId == req.UserId) {
		_, err := dao.CourseAssistants.Ctx(ctx).Where(do.CourseAssistants{
			CourseId:    req.CourseId,
			AssistantId: req.AssistantId,
		}).Delete()
		if err != nil {
			return nil, err
		}
		res = &v1.UnassignCourseAssistantRes{
			Success: true,
		}
		return res, err

	}
	return nil, errors.New("please check whether you have permission to delete assistant")
}
