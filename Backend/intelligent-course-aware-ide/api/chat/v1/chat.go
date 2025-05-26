package v1

import (
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
)

type MessageInfo struct {
	MessageId   int64  `json:"messageId" dc:"Id of this chat message"`
	ChatId      int64  `json:"chatId" dc:"Id of this chat"`
	Message string `json:"Message" dc:"Content of this chat"`
	OwnerId     int64  `json:"ownerId" dc:"Id of this chat message owner"`
}

type ChatUserInfo struct {
	ChatId int64 `json:"chatId" dc:"Id of this chat"`
	UserId int64 `json:"userId" dc:"Id of this chat member"`
}

type GetAllChatMessageOfAChatInfoReq struct {
	g.Meta `path:"/api/chat/getChatMessageOfAChat/{chatId}" method:"get" tags:"Chat" summary:"get all message of this chat"`
	ChatId int64 `json:"chatId" dc:"Id of this chat"`
}

type GetAllChatMessageOfAChatInfoRes struct {
	g.Meta       `mime:"text/html" example:"json"`
	ChatMessages []*entity.ChatMessageInfo `json:"chatMessages" dc:"Info of all message of the chat"`
}

type GetAllChatInfoOfAUserReq struct {
	g.Meta `path:"/api/chat/getChatMessageOfAChat/{userId}" method:"get" tags:"Chat" summary:"get all chat info of this user"`
	UserId int64 `json:"userId" dc:"Id of this user"`
}

type GetAllChatInfoOfAUserRes struct {
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
	g.Meta      `path:"/api/chat/deleteChatMessage" method:"delete" tags:"Chat" summary:"Delete a chat message"`
	ChatMessage MessageInfo `json:"chatMessage" dc:"Info of the chat message"`
}

type DeleteChatMessageRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"Success or not"`
}

type CreateChatReq struct {
	g.Meta   `path:"/api/chat/createChat" method:"post" tags:"Chat" summary:"Create a chat"`
	ChatName string `json:"chatName" dc:"Name of this chat"`
}

type CreateChatRes struct {
	g.Meta `mime:"text/html" example:"json"`
	ChatId int64 `json:"chatId" dc:"Id of the created chat"`
}

type DeleteChatReq struct {
	g.Meta `path:"/api/chat/deleteChatId" method:"delete" tags:"Chat" summary:"Delete a chat"`
	ChatId int64 `json:"chatId" dc:"Id of the chat to delete"`
}

type DeleteChatRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"Success or not"`
}

type AddUserIntoChatReq struct {
	g.Meta   `path:"/api/chat/addUserIntoChat" method:"post" tags:"Chat" summary:"Add a user into a chat"`
	ChatUser ChatUserInfo `json:"chatUserInfo" dc:"new user to be added into chat"`
}

type AddUserIntoChatRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"Success or not"`
}

type DeleteUserFromChatReq struct {
	g.Meta   `path:"/api/chat/deleteUserFromChat" method:"delete" tags:"Chat" summary:"delete a user from a chat"`
	ChatUser ChatUserInfo `json:"chatUserInfo" dc:"user to be delete from chat"`
}

type DeleteUserFromChatRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"Success or not"`
}
