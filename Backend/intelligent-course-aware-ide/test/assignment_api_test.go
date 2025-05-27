package test

import (
	"context"
	V1 "intelligent-course-aware-ide/api/account/v1"
	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/controller/account"
	"intelligent-course-aware-ide/internal/controller/assignment"
	middleware "intelligent-course-aware-ide/internal/logic/middleware"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/gogf/gf/v2/os/gtime"
	"github.com/gogf/gf/v2/test/gtest"
)

func Test_CreateAssignment(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	newassignment := v1.AssignmentInfo{
		AssignmentName: "拿下zyc",
		PublisherId:    1,
		CourseId:       1,
		LectureId:      2,
		Description:    "验证拿下zyc的成果",
		DeadLine:       gtime.New(time.Date(2025, 5, 30, 17, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		Completeness:   2,
	}
	req := &v1.CreateAssignmentReq{
		NewAssignment: newassignment,
	}
	ctrl := &assignment.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.CreateAssignment(cxt, req)
		gtest.AssertNil(err)
		gtest.Assert(res.AssignmentId != 0, true)
	})
}
