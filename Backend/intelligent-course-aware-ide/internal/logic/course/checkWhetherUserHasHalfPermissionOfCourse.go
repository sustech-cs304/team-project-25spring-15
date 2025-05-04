package course

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *Courses) CheckUserHasHalfPermissionOfCourse(ctx context.Context, userId int64, courseId int64) (result bool, err error) {
	var userFound *entity.CourseAssistants
	err = dao.CourseAssistants.Ctx(ctx).Where(do.CourseAssistants{
		CourseId:    courseId,
		AssistantId: userId,
	}).Scan(&userFound)

	if err != nil || userFound == nil {
		return false, err
	}

	return true, nil
}
