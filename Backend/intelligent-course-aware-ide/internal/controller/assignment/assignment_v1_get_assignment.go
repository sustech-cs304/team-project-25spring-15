package assignment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetAssignment(ctx context.Context, req *v1.GetAssignmentReq) (res *v1.GetAssignmentRes, err error) {
	res = &v1.GetAssignmentRes{}
	err = dao.Assignments.Ctx(ctx).WherePri(req.AssignmentId).Scan(&res.Assignment)
	return res, err
}
