// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package assignment

import (
	"context"

	"intelligent-course-aware-ide/api/assignment/v1"
)

type IAssignmentV1 interface {
	GetAllAssignmentInfoOfACourse(ctx context.Context, req *v1.GetAllAssignmentInfoOfACourseReq) (res *v1.GetAllAssignmentInfoOfACourseRes, err error)
	GetAllAssignmentInfoOfALecture(ctx context.Context, req *v1.GetAllAssignmentInfoOfALectureReq) (res *v1.GetAllAssignmentInfoOfALectureRes, err error)
	CreateAssignment(ctx context.Context, req *v1.CreateAssignmentReq) (res *v1.CreateAssignmentRes, err error)
	GetAssignment(ctx context.Context, req *v1.GetAssignmentReq) (res *v1.GetAssignmentRes, err error)
	DeleteAssignment(ctx context.Context, req *v1.DeleteAssignmentReq) (res *v1.DeleteAssignmentRes, err error)
	UpdateAssignment(ctx context.Context, req *v1.UpdateAssignmentReq) (res *v1.UpdateAssignmentRes, err error)
	UploadTestcaseAndAnswer(ctx context.Context, req *v1.UploadTestcaseAndAnswerReq) (res *v1.UploadTestcaseAndAnswerRes, err error)
	DeleteTestcaseAndAnswer(ctx context.Context, req *v1.DeleteTestcaseAndAnswerReq) (res *v1.DeleteTestcaseAndAnswerRes, err error)
	AttemptForAssignment(ctx context.Context, req *v1.AttemptForAssignmentReq) (res *v1.AttemptForAssignmentRes, err error)
	GetAssignmentFeedbackOfAUser(ctx context.Context, req *v1.GetAssignmentFeedbackOfAUserReq) (res *v1.GetAssignmentFeedbackOfAUserRes, err error)
}
