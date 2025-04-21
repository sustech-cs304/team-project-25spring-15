package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

type UserInfoWithPassword struct {
	UserId     int64       `json:"userId" dc:"id of this user"`
	UserName   string      `json:"userName" dc:"name of this user"`
	Email      string      `json:"email" dc:"email of this user"`
	UserSign   string      `json:"usersign" dc:"sign of this user"`
	University string      `json:"university" dc:"university of this user"`
	Birthday   *gtime.Time `json:"birthday" dc:"birthday of this user"`
	Identity   string      `json:"identity" dc:"identity of this user"`
	Password   string      `json:"password" dc:"password of this user"`
}

type UserInfoWithoutPassword struct {
	UserId     int64       `json:"userId" dc:"id of this user"`
	UserName   string      `json:"userName" dc:"name of this user"`
	Email      string      `json:"email" dc:"email of this user"`
	UserSign   string      `json:"usersign" dc:"sign of this user"`
	University string      `json:"university" dc:"university of this user"`
	Birthday   *gtime.Time `json:"birthday" dc:"birthday of this user"`
	Identity   string      `json:"identity" dc:"identity of this user"`
}

type GetAllUsersInfoReq struct {
	g.Meta `path:"/api/user/getUsers" method:"get" tags:"user" summary:"get info of all users"`
}

type GetAllUsersInfoRes struct {
	g.Meta `mime:"text/html" example:"json"`
	Users  []UserInfoWithoutPassword `json:"users" dc:"Info of all users"`
}

type CreateUserReq struct {
	g.Meta  `path:"/api/user/createUser" method:"post" tags:"user" summary:"create user"`
	NewUser UserInfoWithPassword `json:"user" dc:"Info of the user to create"`
}

type CreateUserRes struct {
	g.Meta `mime:"text/html" example:"json"`
	UserId int64 `json:"userId" dc:"id of the new user"`
}

type GetUserReq struct {
	g.Meta `path:"/api/user/searchUser/{userId}" method:"get" tags:"user" summary:"get user info"`
	UserId int64 `v:"required" dc:"id of the user to find"`
}

type GetUserRes struct {
	g.Meta `mime:"text/html" example:"json"`
	User   UserInfoWithoutPassword `json:"user" dc:"info of the user"`
}

type DeleteUserReq struct {
	g.Meta         `path:"/api/user/deleteUser" method:"delete" tags:"user" summary:"delete user info"`
	UserToDeleteId int64 `v:"required" dc:"id of the user to delete"`
	UserId         int64 `json:"userId" v:"required" dc:"id of the user who want to delete this user"`
}

type DeleteUserRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type UpdateUserReq struct {
	g.Meta     `path:"/api/user/updateUser" method:"put" tags:"user" summary:"update user"`
	UpdateUser UserInfoWithPassword `json:"user" dc:"Info of the user to update"`
}

type UpdateUserRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}
