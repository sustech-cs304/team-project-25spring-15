package course

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/frame/g"
)

func (c *ControllerV1) AssignCourseAssistant(ctx context.Context, req *v1.AssignCourseAssistantReq) (res *v1.AssignCourseAssistantRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	result, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return nil, err
	}

	if result {
		res = &v1.AssignCourseAssistantRes{
			Success: false,
		}
		_, err := dao.UserCourseInfo.Ctx(ctx).Where("userId", req.AssistantId).Update(g.Map{"identity": "assistant"})
		if err != nil {
			return res, err
		}
		res.Success = true
		return res, err
	}
	return nil, errors.New("please check whether you have permission to assign course assistant")
}
