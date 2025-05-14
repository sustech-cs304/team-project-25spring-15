package chat

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/chat/v1"
)

func (c *ControllerV1) GetAllChatInfoOfAUser(ctx context.Context, req *v1.GetAllChatInfoOfAUserReq) (res *v1.GetAllChatInfoOfAUserRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
