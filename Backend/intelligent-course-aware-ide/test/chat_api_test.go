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
	newmessgae := v1.MessageInfo{
		ChatId: 1,
		OwnerId: 1,
		Message: "我爱你",
	}
	req := &v1.CreateChatMessageReq{
		ChatMessage: newmessgae,
	}
	ctrl :=&chat.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err := ctrl.CreateChatMessage(context.Background(),req)
		t.AssertNil(err)
		t.Assert(res.MessageId != 0,true)
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
		UserId: 1,
		ChatId: 2,
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