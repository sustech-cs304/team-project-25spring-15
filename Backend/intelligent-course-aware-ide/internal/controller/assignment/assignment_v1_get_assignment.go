package assignment

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/assignment/v1"
)

func (c *ControllerV1) GetAssignment(ctx context.Context, req *v1.GetAssignmentReq) (res *v1.GetAssignmentRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
