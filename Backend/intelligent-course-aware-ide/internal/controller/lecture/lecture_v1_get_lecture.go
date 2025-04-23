package lecture

import (
	"context"

	v1 "intelligent-course-aware-ide/api/lecture/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetLecture(ctx context.Context, req *v1.GetLectureReq) (res *v1.GetLectureRes, err error) {
	res = &v1.GetLectureRes{}
	err = dao.Lectures.Ctx(ctx).WherePri(req.LectureId).Scan(&res.Lecture)
	return res, err
}
