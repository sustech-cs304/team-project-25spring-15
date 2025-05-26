package test
import (
	"context"
	V1 "intelligent-course-aware-ide/api/account/v1"
	v1 "intelligent-course-aware-ide/api/chat/v1"
	"intelligent-course-aware-ide/internal/controller/account"
	"intelligent-course-aware-ide/internal/controller/chat"
	middleware "intelligent-course-aware-ide/internal/logic/middleware"
	"testing"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/gogf/gf/v2/test/gtest"
)
func Test_CreateChat(t *testing.T){
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	req :=&v1.CreateChatReq{
		ChatName: "zyc攻略素养",
	}
	ctrl :=&chat.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err :=ctrl.CreateChat(cxt,req)
		t.AssertNil(err)
		t.Assert(res.ChatId != 0,true)
	})
}
func Test_CreateChatMessage(t *testing.T){
	newmessgae1 := v1.MessageInfo{
		ChatId: 1,
		OwnerId: 1,
		Message: "我爱你",
	}
	newmessgae2 := v1.MessageInfo{
		ChatId: 2,
		OwnerId: 2,
		Message: "我不爱你",
	}
	req1 := &v1.CreateChatMessageReq{
		ChatMessage: newmessgae1,
	}
	req2 :=&v1.CreateChatMessageReq{
		ChatMessage: newmessgae2,
	}
	ctrl :=&chat.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res1,err1 := ctrl.CreateChatMessage(context.Background(),req1)
		t.AssertNil(err1)
		t.Assert(res1.MessageId != 0,true)
		res2,err2 :=ctrl.CreateChatMessage(context.Background(),req2)
		t.AssertNil(err2)
		t.Assert(res2.MessageId != 0,true)
	})
}
func Test_GetAllChatMessageOfChatInfo(t *testing.T){
	newchat :=v1.MessageInfo{
		ChatId: 1,
		OwnerId: 2,
		Message: "我也爱你",
	}
	reqnew :=&v1.CreateChatMessageReq{
		ChatMessage: newchat,
	}
	ctrl :=&chat.ControllerV1{}
	ctrl.CreateChatMessage(context.Background(),reqnew)
	req := &v1.GetAllChatMessageOfAChatInfoReq{
		ChatId: 1,
	}
	gtest.C(t,func(t *gtest.T) {
		res,err := ctrl.GetAllChatMessageOfAChatInfo(context.Background(),req)
		t.AssertNil(err)
		t.Assert(len(res.ChatMessages) == 2,true)
	})
}
func Test_GetAllChatInfoOfUser(t *testing.T){
	req :=&v1.GetAllChatInfoOfAUserReq{
		UserId: 1,
	}
	ctrl :=&chat.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err :=ctrl.GetAllChatInfoOfAUser(context.Background(),req)
		gtest.AssertNil(err)
		gtest.Assert(res.Chats[0].ChatId == 1,true)
	})
}
func Test_AddUserInToChat(t *testing.T){
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	newchatuserinfo := v1.ChatUserInfo{
		UserId: 2,
		ChatId: 1,
	}
	req := &v1.AddUserIntoChatReq{
		ChatUser: newchatuserinfo,
	}
	ctrl := &chat.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err := ctrl.AddUserIntoChat(cxt,req)
		gtest.AssertNil(err)
		gtest.Assert(res.Success,true)
	})
}
func Test_DeleteChatMessage(t *testing.T){
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	messagetodelete :=v1.MessageInfo{
		MessageId: 1,
		ChatId: 1,
		OwnerId: 1,
	}
	req :=&v1.DeleteChatMessageReq{
		ChatMessage: messagetodelete,
	}
	ctrl :=&chat.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err := ctrl.DeleteChatMessage(cxt,req)
		gtest.AssertNil(err)
		gtest.Assert(res.Success,true)
	})
}
func Test_DeleteChat(t *testing.T){
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	req :=&v1.DeleteChatReq{
		ChatId: 2,
	}
	ctrl := &chat.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err := ctrl.DeleteChat(cxt,req)
		gtest.AssertNil(err)
		gtest.Assert(res.Success,true)
	})
}
func Test_DeleteUserFromChat(t *testing.T){
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	chatuserinfo := v1.ChatUserInfo{
		UserId: 2,
		ChatId: 1,
	}
	req := &v1.DeleteUserFromChatReq{
		ChatUser: chatuserinfo,
	}
	ctrl :=&chat.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err := ctrl.DeleteUserFromChat(cxt,req)
		gtest.AssertNil(err)
		gtest.Assert(res.Success,true)
	})
}