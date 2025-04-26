package chat

import (
	"context"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	"intelligent-course-aware-ide/api/chat/v1"
)

func (c *ControllerV1) CreateChat(ctx context.Context, req *v1.CreateChatReq) (res *v1.CreateChatRes, err error) {
	return nil, gerror.NewCode(gcode.CodeNotImplemented)
}
