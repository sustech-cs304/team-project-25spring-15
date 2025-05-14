package lecture

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/lecture/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) DeleteLecture(ctx context.Context, req *v1.DeleteLectureReq) (res *v1.DeleteLectureRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	res = &v1.DeleteLectureRes{
		Success: false,
	}
	result1, err := c.courses.CheckUserHasFullPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return res, err
	}
	result2, err := c.courses.CheckUserHasHalfPermissionOfCourse(ctx, operatorId, req.CourseId)
	if err != nil {
		return res, err
	}

	if result1 || result2 {
		_, err = dao.Lectures.Ctx(ctx).WherePri(req.LectureId).Delete()
		if err != nil {
			return res, err
		}

		operatorName := ctx.Value("operatorName").(string)
		systemInfo := operatorName + "delete lecture:" + req.LectureName
		success, err := c.chats.SendSystemMessage(ctx, systemInfo, req.ChatId)
		if !success || err != nil {
			return res, errors.New("fail to send message")
		}

		res.Success = true
		return res, err
	}
	return nil, errors.New("please check the existence of this lecture or course and whether you have the permission to delete the lecture")
}
