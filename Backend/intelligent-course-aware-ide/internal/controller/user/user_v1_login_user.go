package user

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/user/v1"
	"intelligent-course-aware-ide/internal/dao"
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
	info := ConstructInfo(req.UserInfo)
	num, err := dao.Users.Ctx(ctx).Where(info).Count()
	if err == nil && num == 1 {
		res.Success = true
	}
	return res, err
}
