package assignment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetAllAssignmentInfoOfACourse(ctx context.Context, req *v1.GetAllAssignmentInfoOfACourseReq) (res *v1.GetAllAssignmentInfoOfACourseRes, err error) {
	res = &v1.GetAllAssignmentInfoOfACourseRes{}
	err = dao.Assignments.Ctx(ctx).Where("courseId", req.CourseId).Scan(&res.Assignments)
	if err != nil {
		return res, err
	}
	res.Scores, err = c.assignments.GetScoreOfAssignments(ctx, res.Assignments)
	return res, err
}
