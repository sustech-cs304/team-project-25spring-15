package chat

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/chat/v1"
)

func (c *ControllerV1) DeleteChatMessage(ctx context.Context, req *v1.DeleteChatMessageReq) (res *v1.DeleteChatMessageRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
