package assignment

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/controller/course"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) CreateAssignment(ctx context.Context, req *v1.CreateAssignmentReq) (res *v1.CreateAssignmentRes, err error) {
	result1, err := course.CheckUserHasFullPermission(ctx, req.UserId, req.NewAssignment.CourseId)
	if err != nil {
		return nil, err
	}
	result2, err := course.CheckUserHasHalfPermission(ctx, req.UserId, req.NewAssignment.CourseId)
	if err != nil {
		return nil, err
	}

	if result1 || result2 {
		assignmentId, err := dao.Lectures.Ctx(ctx).Data(req.NewAssignment).InsertAndGetId()
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
