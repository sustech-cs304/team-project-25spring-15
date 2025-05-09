package user

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (u *Users) CheckUserIsStudent(ctx context.Context, userId int64) bool {
	var user *entity.Users
	err := dao.Users.Ctx(ctx).WherePri(userId).Scan(&user)
	if err != nil || user == nil {
		return false
	}

	if user.IdentityU == "student" {
		return true
	}

	return false
}
