package v1

import (
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
	g.Meta  `mime:"text/html" example:"json"`
	Success bool   `json:"success" dc:"success or not"`
	Token   string `json:"token" dc:"token of this time"`
}
