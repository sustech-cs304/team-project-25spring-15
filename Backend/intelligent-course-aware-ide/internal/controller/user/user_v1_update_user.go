package user

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/user/v1"
)

func (c *ControllerV1) UpdateUser(ctx context.Context, req *v1.UpdateUserReq) (res *v1.UpdateUserRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
