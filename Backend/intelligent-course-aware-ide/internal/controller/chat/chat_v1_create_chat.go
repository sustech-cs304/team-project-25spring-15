package chat

import (
	"context"

	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) CreateChat(ctx context.Context, req *v1.CreateChatReq) (res *v1.CreateChatRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.CreateChatRes{}
	res.ChatId, err = dao.Chats.Ctx(ctx).Data("ownerId", operatorId).InsertAndGetId()
	return res, err
}
