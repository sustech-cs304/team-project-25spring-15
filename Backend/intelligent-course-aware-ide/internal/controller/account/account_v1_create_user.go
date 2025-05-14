package account

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/account/v1"
	"intelligent-course-aware-ide/internal/consts"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *ControllerV1) CreateUser(ctx context.Context, req *v1.CreateUserReq) (res *v1.CreateUserRes, err error) {
	if req.NewUser.Identity == "bot" {
		return nil, errors.New("no new bot could be added")
	}

	userId, err := dao.Users.Ctx(ctx).Data(do.Users{
		UserName:   req.NewUser.UserName,
		Email:      req.NewUser.Email,
		UserSign:   req.NewUser.UserSign,
		University: req.NewUser.University,
		Birthday:   req.NewUser.Birthday,
		Identity:   req.NewUser.Identity,
		Password:   req.NewUser.Password,
	}).InsertAndGetId()

	if err != nil {
		return nil, err
	}

	chatId, err := dao.Chats.Ctx(ctx).Data(do.Chats{
		OwnerId:  consts.BotId,
		ChatName: "System message",
	}).InsertAndGetId()
	if err != nil {
		return nil, err
	}

	_, err = dao.ChatUserInfo.Ctx(ctx).Data(do.ChatUserInfo{
		ChatId: chatId,
		UserId: userId,
	}).Insert()

	if err != nil {
		return nil, err
	}

	systemInfo := "Welcome to use this software, hope you have a good experience."
	success, err := c.chats.SendSystemMessage(ctx, systemInfo, chatId)
	if !success || err != nil {
		return nil, errors.New("fail to send message")
	}

	res = &v1.CreateUserRes{
		UserId: userId,
	}
	return res, nil
}
