package assignment

import (
	"context"
	"fmt"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetAllAssignmentInfoOfALecture(ctx context.Context, req *v1.GetAllAssignmentInfoOfALectureReq) (res *v1.GetAllAssignmentInfoOfALectureRes, err error) {
	res = &v1.GetAllAssignmentInfoOfALectureRes{}
	fmt.Println(req.LectureId)
	err = dao.Assignments.Ctx(ctx).Where("lectureId", req.LectureId).Scan(&res.Assignments)
	if err != nil {
		return res, err
	}
	res.Scores, err = c.assignments.GetScoreOfAssignments(ctx, res.Assignments)
	return res, err
}
