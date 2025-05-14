package chat

import (
	"context"
	"errors"
	"intelligent-course-aware-ide/internal/consts"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *Chats) SendSystemMessage(ctx context.Context, systemInfo string, chatId int64) (success bool, err error) {
	var chat *entity.Chats
	err = dao.Chats.Ctx(ctx).WherePri(chatId).Scan(&chat)
	if err != nil {
		return false, errors.New("chat not found")
	}

	if chat == nil {
		return true, nil
	}

	totalNum, err := dao.ChatMessageInfo.Ctx(ctx).Where("chatId", chat.ChatId).Count()
	if err != nil {
		return false, err
	}
	_, err = dao.ChatMessageInfo.Ctx(ctx).Data(do.ChatMessageInfo{
		ChatId:   chat.ChatId,
		OwnerId:  consts.BotId,
		Message:  systemInfo,
		TotalNum: totalNum,
	}).Insert()

	if err != nil {
		return false, err
	}

	return true, nil
}
