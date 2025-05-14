package task

import (
	"context"

	v1 "intelligent-course-aware-ide/api/task/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *ControllerV1) GetAllTaskInfoWithUserId(ctx context.Context, req *v1.GetAllTaskInfoWithUserIdReq) (res *v1.GetAllTaskInfoWithUserIdRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.GetAllTaskInfoWithUserIdRes{}
	var user *entity.Users
	err = dao.Users.Ctx(ctx).WherePri(operatorId).Scan(&user)
	if err != nil {
		return res, err
	}
	if user.Identity == "superuser" {
		err = dao.Tasks.Ctx(ctx).Scan(&res.AllTasks)
	} else {
		err = dao.Tasks.Ctx(ctx).Where("targetApproverId", operatorId).Scan(&res.AllTasks)
	}
	if err != nil {
		return nil, err
	}
	return res, nil
}
