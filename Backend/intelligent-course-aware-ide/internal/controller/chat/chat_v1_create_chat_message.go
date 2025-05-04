package chat

import (
	"context"

	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) CreateChatMessage(ctx context.Context, req *v1.CreateChatMessageReq) (res *v1.CreateChatMessageRes, err error) {
	res = &v1.CreateChatMessageRes{}
	res.MessageId, err = dao.ChatMessageInfo.Ctx(ctx).Data(req.ChatMessage).InsertAndGetId()
	return res, err
}
