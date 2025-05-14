// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package chat

import (
	"context"

	"intelligent-course-aware-ide/api/chat/v1"
)

type IChatV1 interface {
	GetAllChatMessageOfAChatInfo(ctx context.Context, req *v1.GetAllChatMessageOfAChatInfoReq) (res *v1.GetAllChatMessageOfAChatInfoRes, err error)
	GetAllChatInfoOfAUser(ctx context.Context, req *v1.GetAllChatInfoOfAUserReq) (res *v1.GetAllChatInfoOfAUserRes, err error)
	CreateChatMessage(ctx context.Context, req *v1.CreateChatMessageReq) (res *v1.CreateChatMessageRes, err error)
	DeleteChatMessage(ctx context.Context, req *v1.DeleteChatMessageReq) (res *v1.DeleteChatMessageRes, err error)
	CreateChat(ctx context.Context, req *v1.CreateChatReq) (res *v1.CreateChatRes, err error)
	DeleteChat(ctx context.Context, req *v1.DeleteChatReq) (res *v1.DeleteChatRes, err error)
	AddUserIntoChat(ctx context.Context, req *v1.AddUserIntoChatReq) (res *v1.AddUserIntoChatRes, err error)
	DeleteUserFromChat(ctx context.Context, req *v1.DeleteUserFromChatReq) (res *v1.DeleteUserFromChatRes, err error)
}
