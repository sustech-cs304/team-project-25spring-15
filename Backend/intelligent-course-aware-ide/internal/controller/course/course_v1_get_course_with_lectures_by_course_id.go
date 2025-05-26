package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetCourseWithLecturesByCourseId(ctx context.Context, req *v1.GetCourseWithLecturesByCourseIdReq) (res *v1.GetCourseWithLecturesByCourseIdRes, err error) {
	res = &v1.GetCourseWithLecturesByCourseIdRes{}
	err = dao.Courses.Ctx(ctx).Where("courseId", req.CourseId).Scan(&res.Course)
	if err != nil {
		return res, err
	}
	err = dao.Lectures.Ctx(ctx).Where("courseId", req.CourseId).Scan(&res.Course.Lectures)
	if err != nil {
		return res, err
	}
	return res, nil
}
