package lecture

import (
	"context"

	v1 "intelligent-course-aware-ide/api/lecture/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetAllLectureOfACourseInfo(ctx context.Context, req *v1.GetAllLectureOfACourseInfoReq) (res *v1.GetAllLectureOfACourseInfoRes, err error) {
	res = &v1.GetAllLectureOfACourseInfoRes{}
	err = dao.Lectures.Ctx(ctx).Where("courseId", req.CourseId).Scan(&res.Lectures)
	return res, err
}
