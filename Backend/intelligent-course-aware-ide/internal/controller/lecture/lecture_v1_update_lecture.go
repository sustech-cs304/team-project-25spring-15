package lecture

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/lecture/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/utility"
)

func (c *ControllerV1) UpdateLecture(ctx context.Context, req *v1.UpdateLectureReq) (res *v1.UpdateLectureRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.UpdateLectureRes{
		Success: false,
	}

	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, operatorId, req.UpdateLecture.CourseId)
	if err != nil {
		return res, err
	}
	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, operatorId, req.UpdateLecture.CourseId)
	if err != nil {
		return res, err
	}

	if result1 || result2 {
		info := utility.ConstructInfo(req.UpdateLecture, 2)
		_, err = dao.Lectures.Ctx(ctx).Data(info).WherePri(req.UpdateLecture.LectureId).Update()
		if err != nil {
			return res, err
		}
		res.Success = true
		return res, err
	}
	return nil, errors.New("please check whether you have permission to update lecture")
}
