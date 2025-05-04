package chat

import (
	"context"

	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetAllChatMessageOfAChatInfo(ctx context.Context, req *v1.GetAllChatMessageOfAChatInfoReq) (res *v1.GetAllChatMessageOfAChatInfoRes, err error) {
	res = &v1.GetAllChatMessageOfAChatInfoRes{}
	err = dao.ChatMessageInfo.Ctx(ctx).Where("chatId", req.ChatId).Scan(res.ChatMessages)
	return res, err
}
