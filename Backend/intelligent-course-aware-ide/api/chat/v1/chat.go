package v1

import (
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
)

type MessageInfo struct {
	MessageId int64 `json:"messageId" dc:"Id of this chat message"`
	ChatId    int64 `json:"chatId" dc:"Id of this chat"`
	OwnerId   int64 `json:"ownerId" dc:"Id of this chat message owner"`
}

type GetAllChatMessageOfAChatInfoReq struct {
	g.Meta `path:"/api/chat/getChatMessageOfAChat/{chatId}" method:"get" tags:"Chat" summary:"get all message of this chat"`
	ChatId int64 `json:"chatId" dc:"Id of this chat"`
	UserId int64 `json:"userId" dc:"Id of the user who want chatmessage"`
}

type GetAllChatMessageOfAChatInfoRes struct {
	g.Meta       `mime:"text/html" example:"json"`
	ChatMessages []*entity.ChatMessageInfo `json:"chatMessages" dc:"Info of all message of the chat"`
}

type CreateChatMessageReq struct {
	g.Meta      `path:"/api/chat/createChatMessage" method:"post" tags:"Chat" summary:"Create a chat message"`
	ChatMessage MessageInfo `json:"chatMessage" dc:"Info of the chat message"`
}

type CreateChatMessageRes struct {
	g.Meta    `mime:"text/html" example:"json"`
	MessageId int64 `json:"messageId" dc:"Id of the chat message to create"`
}

type DeleteChatMessageReq struct {
	g.Meta    `path:"/api/chat/deleteChatMessage" method:"delete" tags:"Chat" summary:"Delete a chat message"`
	UserId    int64 `json:"userId" dc:"Id of the user who want to delete chat"`
	MessageId int64 `json:"messageId" dc:"Id of the chat message to delete"`
}

type DeleteChatMessageRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"Success or not"`
}

type CreateChatReq struct {
	g.Meta `path:"/api/chat/createChat" method:"post" tags:"Chat" summary:"Create a chat"`
	UserId int64 `json:"userId" dc:"Id of the user who want to create chat"`
}

type CreateChatRes struct {
	g.Meta `mime:"text/html" example:"json"`
	ChatId int64 `json:"chatId" dc:"Id of the created chat"`
}

type DeleteChatReq struct {
	g.Meta `path:"/api/chat/deleteChatId" method:"delete" tags:"Chat" summary:"Delete a chat"`
	UserId int64 `json:"userId" dc:"Id of the user who want to delete chat"`
	ChatId int64 `json:"chatId" dc:"Id of the chat to delete"`
}

type DeleteChatRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"Success or not"`
}

type AddUserIntoChatReq struct {
	g.Meta     `path:"/api/chat/addUserIntoChat" method:"post" tags:"Chat" summary:"Add a user into a chat"`
	OperatorId int64 `json:"operatorId" dc:"Id of the user who want to add a user into a chat"`
	UserId     int64 `json:"userId" dc:"Id of the user who will be added into the chat"`
	ChatId     int64 `json:"chatId" dc:"Id of the chat"`
}

type AddUserIntoChatRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"Success or not"`
}

type DeleteUserFromChatReq struct {
	g.Meta     `path:"/api/chat/deleteUserFromChat" method:"delete" tags:"Chat" summary:"delete a user from a chat"`
	OperatorId int64 `json:"operatorId" dc:"Id of the user who want to remove a user from a chat"`
	UserId     int64 `json:"userId" dc:"Id of the user who will be removed from the chat"`
	ChatId     int64 `json:"chatId" dc:"Id of the chat"`
}

type DeleteUserFromChatRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"Success or not"`
}
