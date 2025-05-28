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
		Deadline:       gtime.New(time.Date(2025, 5, 30, 17, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		Completeness:   2,
	}
	tempassignment := v1.AssignmentInfo{
		AssignmentName: "拿下zyc2",
		PublisherId:    1,
		CourseId:       1,
		LectureId:      2,
		Description:    "验证拿下zyc的成果2",
		Deadline:       gtime.New(time.Date(2025, 5, 30, 18, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		Completeness:   2,
	}
	reqtemp := &v1.CreateAssignmentReq{
		NewAssignment: tempassignment,
	}
	req := &v1.CreateAssignmentReq{
		NewAssignment: newassignment,
	}
	ctrl := &assignment.ControllerV1{}
	ctrl.CreateAssignment(cxt, reqtemp)
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.CreateAssignment(cxt, req)
		gtest.AssertNil(err)
		gtest.Assert(res.AssignmentId != 0, true)
	})
}
func Test_GetAssignment(t *testing.T) {
	req := &v1.GetAssignmentReq{
		AssignmentId: 1,
	}
	ctrl := &assignment.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.GetAssignment(context.Background(), req)
		gtest.AssertNil(err)
		gtest.Assert(res.Assignment.Description, "验证拿下zyc的成果2")
	})
}
func Test_GetAllAssignmentInfoOfLecture(t *testing.T) {
	ctrl := &assignment.ControllerV1{}
	req := &v1.GetAllAssignmentInfoOfALectureReq{
		LectureId: 2,
	}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.GetAllAssignmentInfoOfALecture(context.Background(), req)
		gtest.AssertNil(err)
		gtest.Assert(len(res.Assignments) == 2, true)
	})
}
func Test_GetAllAssignmentInfoOfCourse(t *testing.T) {
	req := &v1.GetAllAssignmentInfoOfACourseReq{
		CourseId: 1,
	}
	ctrl := &assignment.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.GetAllAssignmentInfoOfACourse(context.Background(), req)
		gtest.AssertNil(err)
		gtest.Assert(len(res.Assignments) == 2, true)
	})
}
func Test_UpdateAssignment(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	newassignment := v1.AssignmentInfo{
		AssignmentId: 1,
		CourseId:     1,
		Description:  "update成功",
	}
	req := &v1.UpdateAssignmentReq{
		UpdateAssignment: newassignment,
		CourseName:       "操作系统plus",
		ChatId:           1,
	}
	ctrl := &assignment.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.UpdateAssignment(cxt, req)
		gtest.AssertNil(err)
		gtest.Assert(res.Success, true)
	})
}
func Test_UploadTestCaseAndAnswer(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	newtest := v1.TestcaseAndAnswerInfo{
		AssignmentId: 1,
		PublisherId:  1,
		TestcaseId:   1,
		AnswerId:     1,
		FileType:     "string",
	}
	req := &v1.UploadTestcaseAndAnswerReq{
		TestcaseAndAnswer: newtest,
		CourseId:          1,
		CourseName:        "操作系统plus",
		ChatId:            1,
	}
	ctrl := &assignment.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.UploadTestcaseAndAnswer(cxt, req)
		gtest.AssertNil(err)
		gtest.Assert(res.TestcaseAndAnswerId == 1, true)
	})
}
func Test_AttemoForAssignment(t *testing.T) {
	newattempforassignment := v1.AttemptForAssignment{
		UserId:       1,
		FileId:       1,
		FileType:     "string",
		AssignmentId: 1,
	}
	req := &v1.AttemptForAssignmentReq{
		AssignmentUserAttempt: newattempforassignment,
	}
	ctrl := &assignment.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.AttemptForAssignment(context.Background(), req)
		gtest.AssertNil(err)
		gtest.Assert(res.AssignmentUserFeedback.FeedbackId == 1, true)
	})
}
func Test_DeleteAssignment(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	req := &v1.DeleteAssignmentReq{
		AssignmentId: 1,
		CourseId:     1,
		CourseName:   "操作系统plus",
		ChatId:       1,
	}
	ctrl := &assignment.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.DeleteAssignment(cxt, req)
		gtest.AssertNil(err)
		gtest.Assert(res.Success, true)
	})
}
func Test_DeleteTestCaseAndAnswer(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	req := &v1.DeleteTestcaseAndAnswerReq{
		TestcaseAndAnswerId: 1,
		CourseId:            1,
		CourseName:          "操作系统plus",
		ChatId:              1,
	}
	ctrl := &assignment.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.DeleteTestcaseAndAnswer(cxt, req)
		gtest.AssertNil(err)
		gtest.Assert(res.Success, true)
	})
}
