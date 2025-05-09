package chat

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *Chats) CheckUserHasFullPermissionOfChat(ctx context.Context, userId int64, chatId int64) (success bool, err error) {
	var user *entity.Users
	err = dao.Users.Ctx(ctx).WherePri(userId).Scan(&user)
	if err != nil || user == nil {
		return false, err
	}
	var chat *entity.Chats
	err = dao.Chats.Ctx(ctx).WherePri(chatId).Scan(&chat)
	if err != nil || chat == nil {
		return false, err
	}

	if chat.OwnerId == userId || user.IdentityU == "superuser" {
		return true, nil
	}

	return false, nil
}
