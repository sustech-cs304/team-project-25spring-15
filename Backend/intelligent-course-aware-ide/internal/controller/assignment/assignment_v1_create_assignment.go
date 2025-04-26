package assignment

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
)

func (c *ControllerV1) CreateAssignment(ctx context.Context, req *v1.CreateAssignmentReq) (res *v1.CreateAssignmentRes, err error) {
	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, req.UserId, req.NewAssignment.CourseId)
	if err != nil {
		return nil, err
	}

	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, req.UserId, req.NewAssignment.CourseId)
	if err != nil {
		return nil, err
	}

	if result1 || result2 {
		assignmentId, err := c.assignments.CreateAssignment(ctx, &req.NewAssignment)
		if err != nil {
			return nil, err
		}

		res = &v1.CreateAssignmentRes{
			AssignmentId: assignmentId,
		}
		return res, err
	}
	return nil, errors.New("please check whether you have permission to create assignment")
}
