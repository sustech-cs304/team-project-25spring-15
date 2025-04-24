package assignment

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
)

func (c *ControllerV1) AttemptForAssignment(ctx context.Context, req *v1.AttemptForAssignmentReq) (res *v1.AttemptForAssignmentRes, err error) {

	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
