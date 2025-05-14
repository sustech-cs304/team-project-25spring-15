package task

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/task/v1"
)

func (c *ControllerV1) GetAllTaskInfoWithUserId(ctx context.Context, req *v1.GetAllTaskInfoWithUserIdReq) (res *v1.GetAllTaskInfoWithUserIdRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
