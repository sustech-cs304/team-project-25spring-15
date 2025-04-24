package course

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteCourse(ctx context.Context, req *v1.DeleteCourseReq) (res *v1.DeleteCourseRes, err error) {
	result, err := CheckUserHasFullPermission(ctx, req.UserId, req.CourseId)
	if err != nil {
		return nil, err
	}

	if result {
		_, err := dao.Courses.Ctx(ctx).WherePri(req.CourseId).Delete()
		if err != nil {
			return nil, err
		}
		res = &v1.DeleteCourseRes{
			Success: true,
		}
		return res, nil
	} else {
		err = errors.New("user is not the owner of the course or superuser")
	}

	return res, err
}
