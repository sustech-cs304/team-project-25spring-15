package user

import (
	"context"

	v1 "intelligent-course-aware-ide/api/user/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetAllUsersInfo(ctx context.Context, req *v1.GetAllUsersInfoReq) (res *v1.GetAllUsersInfoRes, err error) {
	res = &v1.GetAllUsersInfoRes{}
	err = dao.Users.Ctx(ctx).Scan(&res.Users)
	return res, err
}
