package runner

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/runner/v1"
)

func (c *ControllerV1) CRunner(ctx context.Context, req *v1.CRunnerReq) (res *v1.CRunnerRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
