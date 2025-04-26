package assignment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
)

func (c *ControllerV1) GetAllAssignmentInfoOfACourse(ctx context.Context, req *v1.GetAllAssignmentInfoOfACourseReq) (res *v1.GetAllAssignmentInfoOfACourseRes, err error) {
	res = &v1.GetAllAssignmentInfoOfACourseRes{}
	res.Assignments, err = c.assignments.GetAllAssignmentsWithCourseId(ctx, req.CourseId)
	return res, err
}
