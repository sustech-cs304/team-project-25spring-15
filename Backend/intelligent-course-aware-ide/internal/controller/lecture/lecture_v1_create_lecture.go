package lecture

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/lecture/v1"
	"intelligent-course-aware-ide/internal/controller/course"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) CreateLecture(ctx context.Context, req *v1.CreateLectureReq) (res *v1.CreateLectureRes, err error) {
	result1, err := course.CheckUserHasFullPermissionOfCourse(ctx, req.UserId, req.NewLecture.CourseId)
	if err != nil {
		return nil, err
	}
	result2, err := course.CheckUserHasHalfPermissionOfCourse(ctx, req.UserId, req.NewLecture.CourseId)
	if err != nil {
		return nil, err
	}

	if result1 || result2 {
		lectureId, err := dao.Lectures.Ctx(ctx).Data(req.NewLecture).InsertAndGetId()
		if err != nil {
			return nil, err
		}

		res = &v1.CreateLectureRes{
			LectureId: lectureId,
		}
		return res, err
	}
	return nil, errors.New("please check whether you have permission to create lecture")
}
