package v1

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

type UserInfoWithPassword struct {
	UserId     int64       `json:"userId" dc:"lectureId of this user"`
	UserName   string      `json:"userName" dc:"name of this user"`
	Email      string      `json:"email" dc:"email of this user"`
	UserSign   string      `json:"usersign" dc:"sign of this user"`
	University string      `json:"university" dc:"university of this user"`
	Birthday   *gtime.Time `json:"birthday" dc:"birthday of this user"`
	Identity   string      `json:"identity" dc:"identity of this user"`
	Password   string      `json:"password" dc:"password of this user"`
}

type UserInfoWithoutPassword struct {
	UserId     int64       `json:"userId" dc:"lectureId of this user"`
	UserName   string      `json:"userName" dc:"name of this user"`
	Email      string      `json:"email" dc:"email of this user"`
	UserSign   string      `json:"usersign" dc:"sign of this user"`
	University string      `json:"university" dc:"university of this user"`
	Birthday   *gtime.Time `json:"birthday" dc:"birthday of this user"`
	Identity   string      `json:"identity" dc:"identity of this user"`
}

type UserLoginInfo struct {
	UserId   int64  `json:"userId" dc:"lectureId of this user"`
	Email    string `json:"email" dc:"email of this user"`
	Password string `json:"password" dc:"password of this user"`
}

type GetAllUsersInfoReq struct {
	g.Meta `path:"/api/user/getUsers" method:"get" tags:"User" summary:"get info of all users"`
}

type GetAllUsersInfoRes struct {
	g.Meta `mime:"text/html" example:"json"`
	Users  []UserInfoWithoutPassword `json:"users" dc:"Info of all users"`
}

type CreateUserReq struct {
	g.Meta  `path:"/api/user/createUser" method:"post" tags:"User" summary:"create user"`
	NewUser UserInfoWithPassword `json:"user" dc:"Info of the user to create"`
}

type CreateUserRes struct {
	g.Meta `mime:"text/html" example:"json"`
	UserId int64 `json:"userId" dc:"lectureId of the new user"`
}

type GetUserReq struct {
	g.Meta `path:"/api/user/searchUser/{userId}" method:"get" tags:"User" summary:"get user info"`
	UserId int64 `v:"required" dc:"lectureId of the user to find"`
}

type GetUserRes struct {
	g.Meta `mime:"text/html" example:"json"`
	User   UserInfoWithoutPassword `json:"user" dc:"info of the user"`
}

type DeleteUserReq struct {
	g.Meta         `path:"/api/user/deleteUser" method:"delete" tags:"User" summary:"delete user info"`
	UserToDeleteId int64 `v:"required" dc:"lectureId of the user to delete"`
	UserId         int64 `json:"userId" v:"required" dc:"lectureId of the user who want to delete this user"`
}

type DeleteUserRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type UpdateUserReq struct {
	g.Meta     `path:"/api/user/updateUser" method:"put" tags:"User" summary:"update user"`
	UpdateUser UserInfoWithPassword `json:"user" dc:"Info of the user to update"`
}

type UpdateUserRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type LoginUserReq struct {
	g.Meta   `path:"/api/user/loginUser" method:"post" tags:"User" summary:"login user"`
	UserInfo UserLoginInfo `json:"userLogin" dc:"Login info of user"`
}

type LoginUserRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}
