package chat

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/chat/v1"
)

func (c *ControllerV1) DeleteUserFromChat(ctx context.Context, req *v1.DeleteUserFromChatReq) (res *v1.DeleteUserFromChatRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
