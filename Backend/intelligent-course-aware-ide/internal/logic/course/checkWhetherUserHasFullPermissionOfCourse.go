package course

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *Courses) CheckUserHasFullPermissionOfCourse(ctx context.Context, userId int64, courseId int64) (result bool, err error) {
	var user *entity.Users
	err = dao.Users.Ctx(ctx).WherePri(userId).Scan(&user)
	if err != nil {
		return false, err
	}

	if user.Identity == "superuser" {
		return true, nil
	}

	var course *entity.Courses
	err = dao.Courses.Ctx(ctx).WherePri(courseId).Scan(&course)
	if err != nil {
		return false, err
	}

	if userId == course.TeacherId {
		return true, nil
	}

	return false, err
}
