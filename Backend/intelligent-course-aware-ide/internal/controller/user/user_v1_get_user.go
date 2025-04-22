package user

import (
	"context"

	v1 "intelligent-course-aware-ide/api/user/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetUser(ctx context.Context, req *v1.GetUserReq) (res *v1.GetUserRes, err error) {
	res = &v1.GetUserRes{}
	err = dao.Users.Ctx(ctx).WherePri(req.UserId).Scan(&res.User)
	return res, err
}
