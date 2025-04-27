package chat

import (
	"context"
	"errors"
	chatv1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *Chats) CheckUserHasHalfPermissionOfChat(ctx context.Context, userId int64, chatId int64) (success bool, err error) {
	chatUser := &chatv1.ChatUserInfo{
		ChatId: chatId,
		UserId: userId,
	}
	cnt, err := dao.ChatUserInfo.Ctx(ctx).Where(chatUser).Count()
	if err != nil {
		return false, err
	}

	if cnt == 1 {
		return true, nil
	}

	return false, errors.New("you are not the member of this chat")
}
