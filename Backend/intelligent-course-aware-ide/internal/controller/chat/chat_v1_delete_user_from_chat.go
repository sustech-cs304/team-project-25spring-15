package chat

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteUserFromChat(ctx context.Context, req *v1.DeleteUserFromChatReq) (res *v1.DeleteUserFromChatRes, err error) {
	res = &v1.DeleteUserFromChatRes{
		Success: false,
	}
	result1, err := c.chats.CheckUserHasFullPermissionOfChat(ctx, req.OperatorId, req.ChatUser.ChatId)
	if err != nil {
		return res, err
	}

	result3 := (req.OperatorId == req.ChatUser.ChatId)

	if result1 || result3 {
		_, err = dao.ChatUserInfo.Ctx(ctx).Where(req.ChatUser).Delete()
		if err != nil {
			return nil, err
		}
		res.Success = true
		return res, nil
	}
	return res, errors.New("you are not operate yourself / the owner of this chat / superuser")
}
