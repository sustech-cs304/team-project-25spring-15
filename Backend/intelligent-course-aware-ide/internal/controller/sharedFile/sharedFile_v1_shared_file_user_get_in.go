package sharedFile

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "intelligent-course-aware-ide/api/sharedFile/v1"
)

func (c *ControllerV1) SharedFileUserGetIn(ctx context.Context, req *v1.SharedFileUserGetInReq) (res *v1.SharedFileUserGetInRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
