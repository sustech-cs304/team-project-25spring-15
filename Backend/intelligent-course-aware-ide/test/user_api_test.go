package test

import (
	"context"
	V1 "intelligent-course-aware-ide/api/account/v1"
	"intelligent-course-aware-ide/api/user/v1"
	"intelligent-course-aware-ide/internal/controller/account"
	"intelligent-course-aware-ide/internal/controller/user"
	middleware "intelligent-course-aware-ide/internal/logic/middleware"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/gogf/gf/v2/os/gtime"
	"github.com/gogf/gf/v2/test/gtest"
)
var TestUsers = []v1.UserInfoWithPassword{
	{
		UserName:   "zyc",
		Email:      "5201314@love.com",
		UserSign:   "I am the most handsome",
		University: "SUSTECH",
		Birthday:   gtime.New(time.Date(2004, 3, 10, 0, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		Identity:   "student",
		Password:   "woshisb",
	},
	{
		UserName:   "zyc2",
		Email:      "user2@example.com",
		UserSign:   "I am user 2",
		University: "SUSTECH",
		Birthday:   gtime.New(time.Date(2003, 4, 11, 0, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		Identity:   "student",
		Password:   "password2",
	},
	{
		UserName:   "zyc3",
		Email:      "user3@example.com",
		UserSign:   "I am user 3",
		University: "SUSTECH",
		Birthday:   gtime.New(time.Date(2002, 5, 12, 0, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		Identity:   "student",
		Password:   "password3",
	},
	{
		UserName:   "zyc4",
		Email:      "user4@example.com",
		UserSign:   "I am user 4",
		University: "SUSTECH",
		Birthday:   gtime.New(time.Date(2001, 6, 13, 0, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		Identity:   "student",
		Password:   "password4",
	},
	{
		UserName:   "zyc5",
		Email:      "user5@example.com",
		UserSign:   "I am user 5",
		University: "SUSTECH",
		Birthday:   gtime.New(time.Date(2000, 7, 14, 0, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		Identity:   "student",
		Password:   "password5",
	},
}
var  NewUser1 = v1.UserInfoWithPassword{
		UserId: 1,
		UserName:   "zyc1",
		Email:      "user@example.com",
		UserSign:   "I am a user",
		University: "SUSTECH",
		Birthday:   gtime.New(time.Date(2004, 3, 10, 0, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		Identity:   "student",
		Password:   "woshisb",
	}

func Test_CreateUser(t *testing.T){
	gtest.C(t,func(t *gtest.T){
		req := &V1.CreateUserReq{}
		ctrl := &account.ControllerV1{}
		for i := range [5]int64{}{
			req = &V1.CreateUserReq{
				NewUser: TestUsers[i],
			}
			res, err := ctrl.CreateUser(context.Background(),req)
			t.AssertNil(err)	
			t.Assert(res.UserId,i + 1)
		}
		
	})
}

//	func Test_CreateUser(t *testing.T) {
//		gtest.C(t, func(t *gtest.T) {
//			req := &v1.CreateUserReq{
//				NewUser: NewUser1,
//			}
//			ctrl := &user.ControllerV1{}
//			res, err := ctrl.CreateUser(context.Background(), req)
//			t.AssertNil(err)
//			t.Assert(res.UserId, 1)
//		})
//	}
func AssertUserEqual(t *gtest.T, actual v1.UserInfoWithoutPassword, expect v1.UserInfoWithPassword) {
	t.Assert(actual.UserName, expect.UserName)
	t.Assert(actual.Email, expect.Email)
	t.Assert(actual.UserSign, expect.UserSign)
	t.Assert(actual.University, expect.University)
	t.Assert(actual.Birthday.Time.UTC().Add(8*time.Hour), expect.Birthday.Time.UTC())
	t.Assert(actual.Identity, expect.Identity)
}
func Test_GetAllUser(t *testing.T) {
	gtest.C(t, func(t *gtest.T) {
		req := &v1.GetAllUsersInfoReq{}
		ctrl := &user.ControllerV1{}
		res, err := ctrl.GetAllUsersInfo(context.Background(), req)
		t.AssertNil(err)
		for i,user := range res.Users{
			AssertUserEqual(t,user,TestUsers[i])
		}	
	})
}
func Test_GetUser(t *testing.T){
	gtest.C(t,func (t *gtest.T)  {
		ctrl := &user.ControllerV1{}
		req := &v1.GetUserReq{}
		for i := range[5]int{}{
			req = &v1.GetUserReq{
				UserId: int64(i + 1),
			}
			res,err := ctrl.GetUser(context.Background(),req)
			t.AssertNil(err)
			AssertUserEqual(t,res.User,TestUsers[i])
		}
	})
}
func Test_UpdateUser(t *testing.T){
	gtest.C(t,func (t *gtest.T)  {
		ctrl := &user.ControllerV1{}
		req := &v1.UpdateUserReq{
			UpdateUser: NewUser1,
		}
		res,err := ctrl.UpdateUser(context.Background(),req)
		t.AssertNil(err)
		t.Assert(res.Success,true)
	})
}
func Test_LoginUser_DeleteUser(t *testing.T){
	gtest.C(t,func (t *gtest.T)  {
		ctrl := &account.ControllerV1{}
		ctrlUser := &user.ControllerV1{}
		req :=&V1.LoginUserReq{}
		for i := range [5]int{}{
			userinfo := V1.UserLoginInfo{
				UserId: int64(i + 1),
				Password: TestUsers[i].Password,
			}
			req = &V1.LoginUserReq{
				UserInfo: userinfo,
			}
			res,err := ctrl.LoginUser(context.Background(),req)
			//fmt.Println(res.Token)
			cxt,_ := middleware.BuildCtx(res.Token)
			reqDelete := &v1.DeleteUserReq{
				UserToDeleteId: int64(i + 1),
			}
			resDelete, errDelete :=ctrlUser.DeleteUser(cxt,reqDelete)
			t.AssertNil(err)
			t.Assert(res.Success,true)
			t.AssertNil(errDelete)
			t.Assert(resDelete.Success,true)
		}
	})
}

