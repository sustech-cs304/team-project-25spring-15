package chatmessage

import (
	"context"
	"errors"
	chatv1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ChatMessages) CheckUserIsTheOwnerOfChatMessage(ctx context.Context, userId int64, chatMessage *chatv1.MessageInfo) (success bool, err error) {
	if chatMessage.ChatId == 0 || chatMessage.MessageId == 0 || chatMessage.OwnerId == 0 {
		return false, errors.New("please input chatId, messageId, ownerId")
	}
	cnt, err := dao.ChatMessageInfo.Ctx(ctx).Where(chatMessage).Count()
	if err != nil {
		return false, err
	}

	if cnt == 1 {
		return true, nil
	}

	return false, errors.New("you are not the owner of this message")
}
