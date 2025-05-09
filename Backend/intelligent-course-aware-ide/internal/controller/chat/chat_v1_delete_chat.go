package chat

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteChat(ctx context.Context, req *v1.DeleteChatReq) (res *v1.DeleteChatRes, err error) {
	operatorId, err := c.logins.GetOperatorIdFromJWT(ctx)
	if err != nil {
		return nil, err
	}
	res = &v1.DeleteChatRes{
		Success: false,
	}
	result1, err := c.chats.CheckUserHasFullPermissionOfChat(ctx, operatorId, req.ChatId)
	if err != nil {
		return res, err
	}

	if result1 {
		_, err = dao.Chats.Ctx(ctx).WherePri(req.ChatId).Delete()
		if err != nil {
			return res, err
		}

		res.Success = true
		return res, nil
	}
	return res, errors.New("you are not superuser or the owner of this chat")
}
