package assignment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
)

func (c *ControllerV1) GetAssignmentFeedbackOfAUser(ctx context.Context, req *v1.GetAssignmentFeedbackOfAUserReq) (res *v1.GetAssignmentFeedbackOfAUserRes, err error) {
	res = &v1.GetAssignmentFeedbackOfAUserRes{}
	res.Feedbacks, err = c.assignmentFeedbacks.GetAssignmentFeedbackWithUserId(ctx, req.UserId)
	return res, err
}
