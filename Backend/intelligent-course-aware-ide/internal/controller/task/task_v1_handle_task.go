package task

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/task/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *ControllerV1) HandleTask(ctx context.Context, req *v1.HandleTaskReq) (res *v1.HandleTaskRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.HandleTaskRes{
		Success: false,
	}
	var task *entity.Tasks
	err = dao.Tasks.Ctx(ctx).WherePri(req.TaskId).Scan(&task)
	if err != nil {
		return res, err
	}

	if task.TargetApproverId == operatorId {
		res.Success = true
		return res, nil
	}

	var user *entity.Users
	err = dao.Users.Ctx(ctx).WherePri(operatorId).Scan(&user)
	if err != nil {
		return res, err
	}
	if user.Identity == "superuser" && task.PublisherId != operatorId {
		res.Success = true
		return res, nil
	}
	return res, errors.New("you are not the target approver/superuser, or you are the user who create this task")
}
