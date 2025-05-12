package v1

import (
	userv1 "intelligent-course-aware-ide/api/user/v1"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/golang-jwt/jwt/v5"
)

type UserLoginInfo struct {
	UserId   int64  `json:"userId" dc:"id of this user"`
	Email    string `json:"email" dc:"email of this user"`
	Password string `json:"password" dc:"password of this user"`
}

type JWTClaims struct {
	UserId int64
	Email  string
	jwt.RegisteredClaims
}

type LoginUserReq struct {
	g.Meta   `path:"/api/user/loginUser" method:"post" tags:"User" summary:"login user"`
	UserInfo UserLoginInfo `json:"userLogin" dc:"Login info of user"`
}

type LoginUserRes struct {
	g.Meta   `mime:"text/html" example:"json"`
	Success  bool                           `json:"success" dc:"success or not"`
	UserInfo userv1.UserInfoWithoutPassword `json:"userInfo" dc:"info of user"`
	Token    string                         `json:"token" dc:"token of this time"`
}

type CreateUserReq struct {
	g.Meta  `path:"/api/user/createUser" method:"post" tags:"User" summary:"create user"`
	NewUser userv1.UserInfoWithPassword `json:"user" dc:"Info of the user to create"`
}

type CreateUserRes struct {
	g.Meta `mime:"text/html" example:"json"`
	UserId int64 `json:"userId" dc:"id of the new user"`
}
