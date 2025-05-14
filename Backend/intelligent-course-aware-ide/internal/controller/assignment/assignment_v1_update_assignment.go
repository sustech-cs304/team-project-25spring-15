package assignment

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/utility"
)

func (c *ControllerV1) UpdateAssignment(ctx context.Context, req *v1.UpdateAssignmentReq) (res *v1.UpdateAssignmentRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.UpdateAssignmentRes{
		Success: false,
	}

	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, operatorId, req.UpdateAssignment.CourseId)
	if err != nil {
		return res, err
	}
	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, operatorId, req.UpdateAssignment.CourseId)
	if err != nil {
		return res, err
	}

	if result1 || result2 {
		info := utility.ConstructInfo(req.UpdateAssignment, 1, 0)
		_, err = dao.Assignments.Ctx(ctx).Data(info).WherePri(req.UpdateAssignment.AssignmentId).Update()
		if err != nil {
			return res, err
		}
		res.Success = true
		return res, err
	}
	return nil, errors.New("please check whether you have permission to update assignment")
}
