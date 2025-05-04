package chat

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteChatMessage(ctx context.Context, req *v1.DeleteChatMessageReq) (res *v1.DeleteChatMessageRes, err error) {
	res = &v1.DeleteChatMessageRes{
		Success: false,
	}
	result1, err := c.chats.CheckUserHasFullPermissionOfChat(ctx, req.UserId, req.ChatMessage.ChatId)
	if err != nil {
		return res, err
	}

	result3, err := c.chatMessages.CheckUserIsTheOwnerOfChatMessage(ctx, req.UserId, &req.ChatMessage)
	if err != nil {
		return res, err
	}

	if result1 || result3 {
		_, err = dao.ChatMessageInfo.Ctx(ctx).Where(req.ChatMessage).Delete()
		if err != nil {
			return res, err
		}
		res.Success = true
		return res, err
	}
	return res, errors.New("please check whether you are the owner of this message / the owner of this chat / superuser")
}
