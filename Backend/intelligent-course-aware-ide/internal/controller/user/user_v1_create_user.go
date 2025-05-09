package user

import (
	"context"

	v1 "intelligent-course-aware-ide/api/user/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) CreateUser(ctx context.Context, req *v1.CreateUserReq) (res *v1.CreateUserRes, err error) {
	userId, err := dao.Users.Ctx(ctx).Data(do.Users{
		UserName:   req.NewUser.UserName,
		Email:      req.NewUser.Email,
		UserSign:   req.NewUser.UserSign,
		University: req.NewUser.University,
		Birthday:   req.NewUser.Birthday,
		IdentityU:   req.NewUser.Identity,
		PasswordU:   req.NewUser.Password,
	}).InsertAndGetId()

	if err != nil {
		return nil, err
	}

	res = &v1.CreateUserRes{
		UserId: userId,
	}
	return res, nil
}
