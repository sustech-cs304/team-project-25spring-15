package course_test

import (
	"context"
	"fmt"
	V1 "intelligent-course-aware-ide/api/account/v1"
	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/controller/account"
	"intelligent-course-aware-ide/internal/controller/course"
	middleware "intelligent-course-aware-ide/internal/logic/middleware"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/gogf/gf/v2/os/gtime"
	"github.com/gogf/gf/v2/test/gtest"
)

var tempCourse = v1.CourseInfo{
	CourseName:  "软件工程",
	Description: "理解软件开发的过程",
	StartTime:   gtime.New(time.Date(2025, 2, 17, 8, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
	EndTime:     gtime.New(time.Date(2025, 6, 9, 17, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
}

func Test_CreateCourse(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, err := ctrlAccount.LoginUser(context.Background(), reqAccount)
	fmt.Println(err)
	cxt, _ := middleware.BuildCtx(resAccount.Token)

	Newcourse := v1.CourseInfo{
		CourseName:  "操作系统",
		Description: "深入理解操作系统原理与实现",
		StartTime:   gtime.New(time.Date(2025, 9, 01, 8, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
		EndTime:     gtime.New(time.Date(2025, 12, 31, 17, 0, 0, 0, time.FixedZone("CST", 8*60*60))),
	}
	gtest.C(t, func(t *gtest.T) {
		req := &v1.CreateCourseReq{
			NewCourse: Newcourse,
		}
		ctrl := &course.ControllerV1{}
		res, err := ctrl.CreateCourse(cxt, req)
		t.AssertNil(err)
		t.Assert(res.CourseId, 1)
	})
}
func Test_GetAllCourse(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	reqTemp := &v1.CreateCourseReq{
		NewCourse: tempCourse,
	}
	ctrl := &course.ControllerV1{}
	ctrl.CreateCourse(cxt, reqTemp)
	gtest.C(t, func(t *gtest.T) {
		req := &v1.GetAllCoursesInfoReq{}
		res, err := ctrl.GetAllCoursesInfo(context.Background(), req)
		t.AssertNil(err)
		for i, course := range res.Courses {
			if i == 0 {
				t.AssertEQ(course.CourseName, "操作系统")
			} else {
				t.AssertEQ(course.CourseName, "软件工程")
			}
		}
	})
}
func Test_GetCourse(t *testing.T) {
	req := &v1.GetCourseReq{
		CourseId: 2,
	}
	ctrl := &course.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.GetCourse(context.Background(), req)
		t.AssertNil(err)
		t.AssertEQ(res.Course.CourseName, "软件工程")
	})
}
func Test_UpdateCourse(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	newcourse := v1.CourseInfo{
		CourseId:   1,
		CourseName: "操作系统Plus",
	}
	req := &v1.UpdateCourseReq{
		UpdateCourse: newcourse,
	}
	ctrl := &course.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.UpdateCourse(cxt, req)
		t.AssertNil(err)
		t.Assert(res.Success, true)
	})
}
func Test_AddStudentsIntoCourse(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	email := []string{
		"user2@example.com",
	}
	req := &v1.AddStudentsIntoCourseReq{
		CourseId:      1,
		StudentsEmail: email,
	}
	ctrl := &course.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.AddStudentsIntoCourse(cxt, req)
		t.AssertNil(err)
		t.Assert(res.Success, true)
	})
}
func Test_AssignCourseAssistant(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	req := &v1.AssignCourseAssistantReq{
		CourseId:    1,
		AssistantId: 2,
	}
	ctrl := &course.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.AssignCourseAssistant(cxt, req)
		t.AssertNil(err)
		t.Assert(res.Success, true)
	})
	// requnassign := &v1.UnassignCourseAssistantReq{
	// 	CourseId:    1,
	// 	AssistantId: 1,
	// }
	// gtest.C(t, func(t *gtest.T) {
	// 	res, err := ctrl.UnassignCourseAssistant(cxt, requnassign)
	// 	t.AssertNil(err)
	// 	t.Assert(res.Success, true)
	// })
}
func Test_UnassignCourseAssistant(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	ctrl := &course.ControllerV1{}
	req := &v1.UnassignCourseAssistantReq{
		CourseId:    1,
		AssistantId: 2,
	}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.UnassignCourseAssistant(cxt, req)
		t.AssertNil(err)
		t.Assert(res.Success, true)
	})
}
func Test_ApplyToJoinCourse(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   3,
		Password: "password3",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	req := &v1.ApplyToJoinCourseReq{
		CourseId:        1,
		ApplicationInfo: "我想学习",
	}
	ctrl := &course.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.ApplyToJoinCourse(cxt, req)
		t.AssertNil(err)
		t.Assert(res.Success, true)
	})
}
func Test_GetCourseWithLecturesByCourseId(t *testing.T) {
	req := &v1.GetCourseWithLecturesByCourseIdReq{
		CourseId: 1,
	}
	ctrl := &course.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.GetCourseWithLecturesByCourseId(context.Background(), req)
		t.AssertNil(err)
		fmt.Println(res.Course)
		t.AssertNE(res.Course, v1.CourseInfoWithLecture{})
	})
}
func Test_GetCourseWithLectureByStudentId(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	ctrl := &course.ControllerV1{}
	req := &v1.GetCourseWithLecturesByStudentIdReq{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.GetCourseWithLecturesByStudentId(cxt, req)
		t.AssertNil(err)
		t.AssertNE(res.Courses, v1.GetCourseWithLecturesByStudentIdReq{})
	})
}

// func Test_SearchCourse(t *testing.T) {
// 	req := &v1.SearchCourseReq{
// 		Keywords:     "操作",
// 		SourceTable:  "name",
// 		RecommendNum: 1,
// 	}
// 	ctrl := &course.ControllerV1{}
// 	gtest.C(t, func(t *gtest.T) {
// 		res, err := ctrl.SearchCourse(context.Background(), req)
// 		t.AssertNil(err)
// 		//这个要改
// 		t.Assert(res.Courses[0].Name, "操作系统Plus")
// 	})
// }

func Test_GetALLStudentsOfCourse(t *testing.T) {
	ctrlAccount := &account.ControllerV1{}
	userinfo := V1.UserLoginInfo{
		UserId:   1,
		Password: "woshisb",
	}
	reqAccount := &V1.LoginUserReq{UserInfo: userinfo}

	resAccount, _ := ctrlAccount.LoginUser(context.Background(), reqAccount)
	cxt, _ := middleware.BuildCtx(resAccount.Token)
	req := &v1.GetAllStudentsOfACourseReq{
		CourseId: 1,
	}
	ctrl := &course.ControllerV1{}
	gtest.C(t, func(t *gtest.T) {
		res, err := ctrl.GetAllStudentsOfACourse(cxt, req)
		gtest.AssertNil(err)
		gtest.Assert(res.Students[0].UserId, 1)
	})
}
