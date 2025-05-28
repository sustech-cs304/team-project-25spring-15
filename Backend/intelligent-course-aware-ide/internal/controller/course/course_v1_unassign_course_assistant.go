package course

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/frame/g"
)

func (c *ControllerV1) UnassignCourseAssistant(ctx context.Context, req *v1.UnassignCourseAssistantReq) (res *v1.UnassignCourseAssistantRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	result, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return nil, err
	}
	if result || (req.AssistantId == operatorId) {
		_, err := dao.UserCourseInfo.Ctx(ctx).Where("userId", req.AssistantId).Update(g.Map{"identity": "student"})
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
