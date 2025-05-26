package chat

import (
	"context"

	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (c *ControllerV1) GetAllChatInfoOfAUser(ctx context.Context, req *v1.GetAllChatInfoOfAUserReq) (res *v1.GetAllChatInfoOfAUserRes, err error) {
	res = &v1.GetAllChatInfoOfAUserRes{}
	err = dao.ChatUserInfo.Ctx(ctx).Where("userId", req.UserId).Scan(&res.Chats)

	return res, err
}
