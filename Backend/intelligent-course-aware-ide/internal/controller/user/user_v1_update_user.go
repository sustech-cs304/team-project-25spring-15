package user

import (
	"context"

	v1 "intelligent-course-aware-ide/api/user/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) UpdateUser(ctx context.Context, req *v1.UpdateUserReq) (res *v1.UpdateUserRes, err error) {
	info := ConstructInfo(req.UpdateUser)
	_, err = dao.Users.Ctx(ctx).Data(info).WherePri(req.UpdateUser.UserId).Update()
	res = &v1.UpdateUserRes{
		Success: false,
	}
	if err != nil {
		return res, err
	}
	res.Success = true
	return res, err
}
