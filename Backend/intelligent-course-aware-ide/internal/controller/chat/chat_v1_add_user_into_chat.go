package chat

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) AddUserIntoChat(ctx context.Context, req *v1.AddUserIntoChatReq) (res *v1.AddUserIntoChatRes, err error) {
	res = &v1.AddUserIntoChatRes{
		Success: false,
	}
	result1, err := c.chats.CheckUserHasFullPermissionOfChat(ctx, req.OperatorId, req.ChatUser.ChatId)
	if err != nil {
		return res, err
	}
	result2, err := c.chats.CheckUserHasHalfPermissionOfChat(ctx, req.OperatorId, req.ChatUser.ChatId)
	if err != nil {
		return res, err
	}

	if result1 || result2 {
		_, err = dao.ChatUserInfo.Ctx(ctx).Data(req.ChatUser).Insert()
		if err != nil {
			return res, err
		}
		res.Success = true
		return res, err
	}
	return res, errors.New("you are not the owner/member of this chat and you are not a superuser")
}
