package assignment

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/assignment/v1"
)

func (c *ControllerV1) DeleteAssignment(ctx context.Context, req *v1.DeleteAssignmentReq) (res *v1.DeleteAssignmentRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
