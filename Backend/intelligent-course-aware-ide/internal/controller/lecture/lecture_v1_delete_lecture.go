package lecture

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/lecture/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteLecture(ctx context.Context, req *v1.DeleteLectureReq) (res *v1.DeleteLectureRes, err error) {
	operaterId, err := c.logins.GetOperatorIdFromJWT(ctx)
	if err != nil {
		return nil, err
	}

	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, operaterId, req.CourseId)
	if err != nil {
		return nil, err
	}
	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, operaterId, req.CourseId)
	if err != nil {
		return nil, err
	}

	if result1 || result2 {
		_, err = dao.Lectures.Ctx(ctx).WherePri(req.LectureId).Delete()
		if err != nil {
			return nil, err
		}

		res = &v1.DeleteLectureRes{
			Success: true,
		}
		return res, err
	}
	return nil, errors.New("please check the existence of this lecture or course and whether you have the permission to delete the lecture")
}
