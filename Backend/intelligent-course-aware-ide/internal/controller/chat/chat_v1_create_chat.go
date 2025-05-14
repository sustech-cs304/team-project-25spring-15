package chat

import (
	"context"

	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) CreateChat(ctx context.Context, req *v1.CreateChatReq) (res *v1.CreateChatRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.CreateChatRes{}
	res.ChatId, err = dao.Chats.Ctx(ctx).Data(do.Chats{
		OwnerId:  operatorId,
		ChatName: req.ChatName,
	}).InsertAndGetId()
	return res, err
}
