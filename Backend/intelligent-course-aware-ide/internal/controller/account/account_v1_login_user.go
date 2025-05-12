package account

import (
	"context"
	"errors"
	"time"

	v1 "intelligent-course-aware-ide/api/account/v1"
	"intelligent-course-aware-ide/internal/consts"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/utility"

	"github.com/gogf/gf/frame/g"
	"github.com/golang-jwt/jwt/v5"
)

func (c *ControllerV1) LoginUser(ctx context.Context, req *v1.LoginUserReq) (res *v1.LoginUserRes, err error) {
	res = &v1.LoginUserRes{
		Success: false,
	}
	if req.UserInfo.UserId == 0 && req.UserInfo.Email == "" {
		return nil, errors.New("at least one of email and userid should be provided")
	}
	if req.UserInfo.Password == "" {
		return nil, errors.New("password should not be empty")
	}
	info := utility.ConstructInfo(req.UserInfo, 0)
	err = dao.Users.Ctx(ctx).Where(info).Scan(&res.UserInfo)
	if err == nil {
		_, err := dao.Users.Ctx(ctx).Where("userId", req.UserInfo.UserId).Update(g.Map{"login": 1})
		if err != nil {
			return nil, err
		}
		res.Success = true
		uc := &v1.JWTClaims{
			UserId: res.UserInfo.UserId,
			Email:  res.UserInfo.Email,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(time.Now().Add(consts.JWTTime * time.Hour)),
			},
		}
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, uc)
		res.Token, err = token.SignedString([]byte(consts.JWTKey))
		if err != nil {
			return nil, err
		}
		return res, nil
	}
	return res, err
}
