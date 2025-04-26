package assignment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
)

func (c *ControllerV1) GetAssignment(ctx context.Context, req *v1.GetAssignmentReq) (res *v1.GetAssignmentRes, err error) {
	res = &v1.GetAssignmentRes{}
	res.Assignment, err = c.assignments.GetAssignmentWithAssignmentId(ctx, req.AssignmentId)
	return res, err
}
