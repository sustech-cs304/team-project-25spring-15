// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package course

import (
	"context"

	"intelligent-course-aware-ide/api/course/v1"
)

type ICourseV1 interface {
	GetAllCoursesInfo(ctx context.Context, req *v1.GetAllCoursesInfoReq) (res *v1.GetAllCoursesInfoRes, err error)
	SearchCourse(ctx context.Context, req *v1.SearchCourseReq) (res *v1.SearchCourseRes, err error)
	RecommandCourse(ctx context.Context, req *v1.RecommandCourseReq) (res *v1.RecommandCourseRes, err error)
	CreateCourse(ctx context.Context, req *v1.CreateCourseReq) (res *v1.CreateCourseRes, err error)
	GetCourseWithLecturesByCourseId(ctx context.Context, req *v1.GetCourseWithLecturesByCourseIdReq) (res *v1.GetCourseWithLecturesByCourseIdRes, err error)
	GetCourseWithLecturesByStudentId(ctx context.Context, req *v1.GetCourseWithLecturesByStudentIdReq) (res *v1.GetCourseWithLecturesByStudentIdRes, err error)
	GetCourse(ctx context.Context, req *v1.GetCourseReq) (res *v1.GetCourseRes, err error)
	DeleteCourse(ctx context.Context, req *v1.DeleteCourseReq) (res *v1.DeleteCourseRes, err error)
	UpdateCourse(ctx context.Context, req *v1.UpdateCourseReq) (res *v1.UpdateCourseRes, err error)
	AssignCourseAssistant(ctx context.Context, req *v1.AssignCourseAssistantReq) (res *v1.AssignCourseAssistantRes, err error)
	UnassignCourseAssistant(ctx context.Context, req *v1.UnassignCourseAssistantReq) (res *v1.UnassignCourseAssistantRes, err error)
	ApplyToJoinCourse(ctx context.Context, req *v1.ApplyToJoinCourseReq) (res *v1.ApplyToJoinCourseRes, err error)
}
