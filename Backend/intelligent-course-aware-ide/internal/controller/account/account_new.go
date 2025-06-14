// =================================================================================
// This is auto-generated by GoFrame CLI tool only once. Fill this file as you wish.
// =================================================================================

package account

import (
	"intelligent-course-aware-ide/api/account"
	chatLogic "intelligent-course-aware-ide/internal/logic/chat"
	//userLogic "intelligent-course-aware-ide/internal/logic/user"
)

type ControllerV1 struct {
	chats *chatLogic.Chats
	//users *userLogic.Users
}

func NewV1() account.IAccountV1 {
	return &ControllerV1{
		chats: chatLogic.New(),
		//users: userLogic.New(),
	}
}
