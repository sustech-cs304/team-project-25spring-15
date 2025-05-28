package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
)

func (c *ControllerV1) GetCourseWithLecturesByCourseId(ctx context.Context, req *v1.GetCourseWithLecturesByCourseIdReq) (res *v1.GetCourseWithLecturesByCourseIdRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.GetCourseWithLecturesByCourseIdRes{}
	err = dao.Courses.Ctx(ctx).Where("courseId", req.CourseId).Scan(&res.Course)
	if err != nil {
		return res, err
	}
	err = dao.Lectures.Ctx(ctx).Where("courseId", req.CourseId).Scan(&res.Course.Lectures)
	if err != nil {
		return res, err
	}
	var userCourseInfo *entity.UserCourseInfo
	err = dao.UserCourseInfo.Ctx(ctx).Where(g.Map{
		"userId":   operatorId,
		"courseId": req.CourseId,
	}).Scan(&userCourseInfo)
	if err != nil {
		return res, err
	}
	res.CourseIdentity = userCourseInfo.Identity
	return res, nil
}
