package test

import (
	"context"
	V1 "intelligent-course-aware-ide/api/account/v1"
	v1 "intelligent-course-aware-ide/api/lecture/v1"
	"intelligent-course-aware-ide/internal/controller/account"
	"intelligent-course-aware-ide/internal/controller/lecture"
	middleware "intelligent-course-aware-ide/internal/logic/middleware"
	"testing"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/gogf/gf/v2/test/gtest"
)

func Test_CreateLecture(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	newlecture := v1.LectureInfo{
		CourseId:    1,
		LectureId:   2,
		LectureName: "虚拟化",
		Description: "虚拟化第一章",
	}
	req := &v1.CreateLectureReq{
		NewLecture: newlecture,
	}
	ctrl := &lecture.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.CreateLecture(cxt, req)
		t.AssertNil(err)
		t.Assert(res.LectureId, 2)
	})
}
func Test_GetAllLectureOfCourse(t *testing.T){
	req :=&v1.GetAllLectureOfACourseInfoReq{
		CourseId: 1,
	}
	ctrl :=&lecture.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err := ctrl.GetAllLectureOfACourseInfo(context.Background(),req)
		t.AssertNil(err)
		t.Assert(len(res.Lectures)== 2,true)
	})
}
func Test_GetLecture(t *testing.T){
	req := &v1.GetLectureReq{
		LectureId: 2,
	}
	ctrl :=&lecture.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err :=ctrl.GetLecture(context.Background(),req)
		t.AssertNil(err)
		t.Assert(res.Lecture.LectureName,"虚拟化")
	})
}
func Test_UpdateLecture(t *testing.T){
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}
	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	newlecture :=v1.LectureInfo{
		LectureId: 2,
		Description: "新的虚拟化",
		CourseId: 1,
	}
	req :=&v1.UpdateLectureReq{
		UpdateLecture: newlecture,
	}
	ctrl := &lecture.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err := ctrl.UpdateLecture(cxt,req)
		t.AssertNil(err)
		t.Assert(res.Success,true)
	})
}
func Test_DeleteLecture(t *testing.T){
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}
	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	req :=&v1.DeleteLectureReq{
		LectureId: 1,
		CourseId: 1,
		LectureName: "虚拟化",
		ChatId: 6,
	}
	ctrl :=&lecture.ControllerV1{}
	gtest.C(t,func(t *gtest.T) {
		res,err :=ctrl.DeleteLecture(cxt,req)
		t.AssertNil(err)
		t.Assert(res.Success,true)
	})
}