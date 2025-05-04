package user

import (
	"context"
	"errors"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (u *Users) CheckUserHasPermssionOfUser(ctx context.Context, userId int64, operatorId int64) (success bool, err error) {
	var user *entity.Users
	err = dao.Users.Ctx(ctx).WherePri(userId).Scan(&user)
	if err != nil || user == nil {
		return false, errors.New("maybe it is because user to delete not found")
	}

	var operator *entity.Users
	err = dao.Users.Ctx(ctx).WherePri(operatorId).Scan(&operator)
	if err != nil || operator == nil {
		return false, errors.New("maybe it is because user not found")
	}

	if operatorId == userId || (operator.Identity == "superuser" && user.Identity != "superuser") {
		return true, nil
	} else {
		return false, errors.New("user is not the user to be deleted or user to delete is superuser")
	}
}
