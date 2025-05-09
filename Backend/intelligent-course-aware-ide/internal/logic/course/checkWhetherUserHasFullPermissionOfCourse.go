package course

import (
	"context"
	"errors"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *Courses) CheckUserHasFullPermissionOfCourse(ctx context.Context, userId int64, courseId int64) (result bool, err error) {
	var user *entity.Users
	err = dao.Users.Ctx(ctx).WherePri(userId).Scan(&user)
	if err != nil || user == nil {
		return false, errors.New("maybe user does not exist")
	}

	var course *entity.Courses
	err = dao.Courses.Ctx(ctx).WherePri(courseId).Scan(&course)
	if err != nil || course == nil {
		return false, errors.New("maybe course does not exist")
	}

	if userId == course.TeacherId || user.IdentityU == "superuser" {
		return true, nil
	}

	return false, err
}
