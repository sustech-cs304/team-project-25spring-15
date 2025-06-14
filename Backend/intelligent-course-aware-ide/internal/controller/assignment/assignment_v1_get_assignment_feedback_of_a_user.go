package assignment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetAssignmentFeedbackOfAUser(ctx context.Context, req *v1.GetAssignmentFeedbackOfAUserReq) (res *v1.GetAssignmentFeedbackOfAUserRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.GetAssignmentFeedbackOfAUserRes{}
	err = dao.AssignmentUserFeedback.Ctx(ctx).Where("performerId", operatorId).Scan(&res.Feedbacks)
	return res, err
}
