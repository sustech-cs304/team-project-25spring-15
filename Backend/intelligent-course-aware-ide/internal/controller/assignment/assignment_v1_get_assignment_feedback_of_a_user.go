package assignment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) GetAssignmentFeedbackOfAUser(ctx context.Context, req *v1.GetAssignmentFeedbackOfAUserReq) (res *v1.GetAssignmentFeedbackOfAUserRes, err error) {
	res = &v1.GetAssignmentFeedbackOfAUserRes{}
	err = dao.AssignmentUserFeedback.Ctx(ctx).Where(do.AssignmentUserFeedback{
		AssignmentId: req.AssignmentId,
		PerformerId:  req.UserId,
	}).Scan(&res.Feedbacks)
	return res, err
}
