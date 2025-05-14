package chat

import (
	"context"

	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/frame/g"
)

func (c *ControllerV1) GetAllChatMessageOfAChatInfo(ctx context.Context, req *v1.GetAllChatMessageOfAChatInfoReq) (res *v1.GetAllChatMessageOfAChatInfoRes, err error) {
	res = &v1.GetAllChatMessageOfAChatInfoRes{}
	err = dao.ChatMessageInfo.Ctx(ctx).Where("chatId", req.ChatId).Scan(res.ChatMessages)
	if err != nil {
		return res, err
	}

	_, err = dao.ChatUserInfo.Ctx(ctx).Where("chatId", req.ChatId).Update(g.Map{"hasRead": len(res.ChatMessages)})

	return res, err
}
