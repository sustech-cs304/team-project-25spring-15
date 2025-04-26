package assignment

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
)

func (c *ControllerV1) DeleteAssignment(ctx context.Context, req *v1.DeleteAssignmentReq) (res *v1.DeleteAssignmentRes, err error) {
	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, req.UserId, req.CourseId)
	if err != nil {
		return nil, err
	}
	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, req.UserId, req.CourseId)
	if err != nil {
		return nil, err
	}

	if result1 || result2 {
		err = c.assignments.DeleteAssignment(ctx, req.AssignmentId)
		if err != nil {
			return nil, err
		}

		res = &v1.DeleteAssignmentRes{
			Success: true,
		}
		return res, err
	}
	return nil, errors.New("please check the existence of this lecture or course and whether you have the permission to delete the assignment")
}
