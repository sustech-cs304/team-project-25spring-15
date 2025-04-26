package assignment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
)

func (c *ControllerV1) GetAllAssignmentInfoOfALecture(ctx context.Context, req *v1.GetAllAssignmentInfoOfALectureReq) (res *v1.GetAllAssignmentInfoOfALectureRes, err error) {
	res = &v1.GetAllAssignmentInfoOfALectureRes{}
	res.Assignments, err = c.assignments.GetAllAssignmentsWithLectureId(ctx, req.LectureId)
	return res, err
}
