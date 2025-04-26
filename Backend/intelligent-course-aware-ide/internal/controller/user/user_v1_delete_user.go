package user

import (
	"context"

	v1 "intelligent-course-aware-ide/api/user/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteUser(ctx context.Context, req *v1.DeleteUserReq) (res *v1.DeleteUserRes, err error) {
	success, err := c.users.CheckUserHasPermssionOfUser(ctx, req.UserToDeleteId, req.UserId)
	if err != nil || !success {
		return nil, err
	}

	_, err = dao.Users.Ctx(ctx).WherePri(req.UserToDeleteId).Delete()
	if err == nil {
		res = &v1.DeleteUserRes{
			Success: true,
		}
	}
	return res, err
}
