package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	userv1 "intelligent-course-aware-ide/api/user/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *ControllerV1) GetAllStudentsOfACourse(ctx context.Context, req *v1.GetAllStudentsOfACourseReq) (res *v1.GetAllStudentsOfACourseRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.GetAllStudentsOfACourseRes{}
	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return nil, err
	}

	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return nil, err
	}
	if result1 || result2 {
		var studentCoursesInfo []*entity.UserCourseInfo
		err = dao.UserCourseInfo.Ctx(ctx).Where("courseId", req.CourseId).Scan(&studentCoursesInfo)
		if err != nil {
			return res, err
		}
		for _, studentCourseInfo := range studentCoursesInfo {
			var student userv1.UserInfoWithoutPassword
			err = dao.Users.Ctx(ctx).WherePri(studentCourseInfo.UserId).Scan(student)
			if err != nil {
				return res, err
			}
			res.Students = append(res.Students, student)
		}
	}
	return res, nil
}
