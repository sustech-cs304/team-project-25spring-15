package sharedFile

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/sharedFile/v1"
)

func (c *ControllerV1) ConnectSharedFile(ctx context.Context, req *v1.ConnectSharedFileReq) (res *v1.ConnectSharedFileRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
