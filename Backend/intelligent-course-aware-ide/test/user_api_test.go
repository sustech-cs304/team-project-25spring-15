package test

import (
	"time"
	"context"
	"intelligent-course-aware-ide/api/user/v1"
	"intelligent-course-aware-ide/internal/controller/user"
	"testing"

	"github.com/gogf/gf/v2/os/gtime"
	"github.com/gogf/gf/v2/test/gtest"
	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
)
func init() {
	gtime.SetTimeZone("Asia/Shanghai")
}
var  NewUser1 = v1.UserInfoWithPassword{
		UserName:   "zyc",
		Email:      "5201314@love.com",
		UserSign:   "I am the most handsome",
		University: "SUSTECH",
		Birthday:   gtime.New(time.Date(2004, 3, 10, 0, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		Identity:   "student",
		Password:   "woshisb",
	}

func Test_CreateUser(t *testing.T){
	gtest.C(t,func(t *gtest.T){
		req := &v1.CreateUserReq{
			NewUser :NewUser1,
		}
		ctrl := &user.ControllerV1{}
		res, err := ctrl.CreateUser(context.Background(),req)
		t.AssertNil(err)
		t.Assert(res.UserId,1)
	})
}
func AssertUserEqual(t *gtest.T,actual v1.UserInfoWithoutPassword, expect v1.UserInfoWithPassword){
	t.Assert(actual.UserName,expect.UserName)
	t.Assert(actual.Email,expect.Email)
	t.Assert(actual.UserSign,expect.UserSign)
	t.Assert(actual.University,expect.University)
	t.Assert(actual.Birthday.Time.UTC().Add(8 * time.Hour),expect.Birthday.Time.UTC())
	t.Assert(actual.Identity,expect.Identity)
}
func Test_GetAllUser(t *testing.T){
	gtest.C(t,func (t *gtest.T)  {
		req := &v1.GetAllUsersInfoReq{}
		ctrl :=&user.ControllerV1{}
		res,err := ctrl.GetAllUsersInfo(context.Background(),req)
		t.AssertNil(err)
		for _,user := range res.Users{
			AssertUserEqual(t,user,NewUser1)
		}	
	})
}