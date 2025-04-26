package lecture

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/lecture/v1"
	"intelligent-course-aware-ide/internal/controller/course"
	"intelligent-course-aware-ide/internal/controller/user"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) UpdateLecture(ctx context.Context, req *v1.UpdateLectureReq) (res *v1.UpdateLectureRes, err error) {
	res = &v1.UpdateLectureRes{
		Success: false,
	}

	result1, err := course.CheckUserHasFullPermissionOfCourse(ctx, req.UserId, req.UpdateLecture.CourseId)
	if err != nil {
		return res, err
	}
	result2, err := course.CheckUserHasHalfPermissionOfCourse(ctx, req.UserId, req.UpdateLecture.CourseId)
	if err != nil {
		return res, err
	}

	if result1 || result2 {
		info := user.ConstructInfo(req.UpdateLecture)
		_, err = dao.Lectures.Ctx(ctx).Data(info).WherePri(req.UpdateLecture.LectureId).Update()
		if err != nil {
			return res, err
		}
		res.Success = true
		return res, err
	}
	return nil, errors.New("please check whether you have permission to update lecture")
}
