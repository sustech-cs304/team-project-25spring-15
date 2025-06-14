package course

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) CreateCourse(ctx context.Context, req *v1.CreateCourseReq) (res *v1.CreateCourseRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)

	if c.users.CheckUserIsStudent(ctx, operatorId) {
		return nil, errors.New("please check whether you are superuser or teacher")
	}

	chatId, err := dao.Chats.Ctx(ctx).Data(do.Chats{
		OwnerId:  operatorId,
		ChatName: req.NewCourse.CourseName,
	}).InsertAndGetId()

	if err != nil {
		return nil, err
	}

	courseId, err := dao.Courses.Ctx(ctx).Data(do.Courses{
		TeacherId:   operatorId,
		CourseName:  req.NewCourse.CourseName,
		Description: req.NewCourse.Description,
		StartTime:   req.NewCourse.StartTime,
		EndTime:     req.NewCourse.EndTime,
		ChatId:      chatId,
	}).InsertAndGetId()
	if err != nil {
		return nil, err
	}

	_, err = dao.UserCourseInfo.Ctx(ctx).Data(do.UserCourseInfo{
		UserId:   operatorId,
		CourseId: courseId,
		Identity: "teacher",
	}).Insert()

	if err != nil {
		return nil, err
	}

	res = &v1.CreateCourseRes{
		CourseId: courseId,
	}
	return res, nil
}
