package chat

import (
	"context"
	"errors"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *Chats) CheckUserHasFullPermissionOfChat(ctx context.Context, userId int64, chatId int64) (success bool, err error) {
	var user *entity.Users
	err = dao.Users.Ctx(ctx).WherePri(userId).Scan(&user)
	if err != nil {
		return false, err
	}
	var chat *entity.Chats
	err = dao.Chats.Ctx(ctx).WherePri(chatId).Scan(&chat)
	if err != nil {
		return false, err
	}

	if chat.OwnerId == userId || user.Identity == "superuser" {
		return true, nil
	}

	return false, errors.New("you are not the owner of the chat or superuser")
}
