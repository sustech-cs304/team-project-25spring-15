package ai

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/ai/v1"
)

func (c *ControllerV1) AskForAi(ctx context.Context, req *v1.AskForAiReq) (res *v1.AskForAiRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
