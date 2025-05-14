package course

import (
	"context"
	"errors"

	"github.com/gogf/gf/v2/frame/g"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *ControllerV1) ApplyToJoinCourse(ctx context.Context, req *v1.ApplyToJoinCourseReq) (res *v1.ApplyToJoinCourseRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	operatorName := ctx.Value("operatorName").(string)
	res = &v1.ApplyToJoinCourseRes{
		Success: false,
	}

	var course *entity.Courses
	err = dao.Courses.Ctx(ctx).WherePri(req.CourseId).Scan(&course)
	if err != nil {
		return res, err
	}
	if operatorId == course.TeacherId {
		return res, errors.New("you are the teacher of this course")
	}
	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return res, err
	}
	cnt, err := dao.Tasks.Ctx(ctx).Where(g.Map{"courseId": course.CourseId, "publisherId": operatorId}).Count()
	if err != nil {
		return res, err
	}
	if result2 || cnt != 0 {
		return res, errors.New("you have joined this course")
	}

	_, err = dao.Tasks.Ctx(ctx).Data(do.Tasks{
		TargetApproverId: course.TeacherId,
		PublisherId:      operatorId,
		PublisherName:    operatorName,
		CourseId:         course.CourseId,
		Kind:             "join_course",
		TaskInfo:         req.ApplicationInfo,
	}).Insert()

	if err != nil {
		return res, err
	}
	res.Success = true
	return res, nil
}
