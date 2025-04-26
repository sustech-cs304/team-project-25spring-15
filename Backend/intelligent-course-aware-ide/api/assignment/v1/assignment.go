package v1

import (
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
)

type AssignmentInfo struct {
	AssignmentId int64       `json:"assignmentId" dc:"id of this assignment"`
	PublisherId  int64       `json:"publisherId" dc:"id of publisher"`
	CourseId     int64       `json:"courseId" dc:"id of this course"`
	LectureId    int64       `json:"lectureId" dc:"id of this lecture"`
	Description  string      `json:"description" dc:"description of this assignment"`
	DeadLine     *gtime.Time `json:"deadLine" dc:"end time of this assignment"`
	Completeness int32       `json:"completeness" dc:"num of the student who has finished this"`
}

type AttemptForAssignment struct {
	UserId       int64  `json:"userId" dc:"id of user"`
	FileId       int64  `json:"fileId" dc:"id of file"`
	FileType     string `json:"fileType" dc:"type of file"`
	AssignmentId int64  `json:"assignmentId" dc:"id of assignment"`
}

type FeedbackForAssignmentInfo struct {
	FeedbackId   int64  `json:"feedbackId" dc:"id of feedback"`
	PerformerId  int64  `json:"performerId" dc:"id of performer"`
	AssignmentId int64  `json:"assignmentId" dc:"id of assignment"`
	Score        int    `json:"score" dc:"score of this attempt"`
	FileId       int64  `json:"fileId" dc:"id of this attempt file"`
	FileType     string `json:"fileType" dc:"type of this attempt file"`
}

type TestcaseAndAnswerInfo struct {
	AssignmentId int64  `json:"assignmentId" dc:"id of this assignment"`
	PublisherId  int64  `json:"publisherId" dc:"id of the publisher"`
	TestcaseId   int64  `json:"testcaseId" dc:"id of this testcase file"`
	AnswerId     int64  `json:"answerId" dc:"id of the answer to the testcase"`
	FileType     string `json:"fileType" dc:"type of this testcase"`
}

type GetAllAssignmentInfoOfACourseReq struct {
	g.Meta   `path:"/api/assignment/getAllAssignmentOfACourse" method:"get" tags:"Assignment" summary:"get info of all assignment of a course"`
	CourseId int64 `json:"courseId" dc:"Id of this course"`
}

type GetAllAssignmentInfoOfACourseRes struct {
	g.Meta      `mime:"text/html" example:"json"`
	Assignments []*entity.Assignments `json:"assignments" dc:"Info of all assignments of a course"`
}

type GetAllAssignmentInfoOfALectureReq struct {
	g.Meta    `path:"/api/assignment/getAllAssignmentOfALecture" method:"get" tags:"Assignment" summary:"get info of all assignment of a lecture"`
	LectureId int64 `json:"lectureId" dc:"Id of this lecture"`
}

type GetAllAssignmentInfoOfALectureRes struct {
	g.Meta      `mime:"text/html" example:"json"`
	Assignments []*entity.Assignments `json:"assignments" dc:"Info of all assignments of a lecture"`
}

type CreateAssignmentReq struct {
	g.Meta        `path:"/api/assignment/createAssignment" method:"post" tags:"Assignment" summary:"create assignment"`
	NewAssignment AssignmentInfo `json:"assignment" dc:"Info of the assignment to create"`
	UserId        int64          `json:"userId" dc:"Id of the user who want to create assignment"`
}

type CreateAssignmentRes struct {
	g.Meta       `mime:"text/html" example:"json"`
	AssignmentId int64 `json:"assignmentId" dc:"id of the new assignment"`
}

type GetAssignmentReq struct {
	g.Meta       `path:"/api/assignment/searchAssignment/{assignmentId}" method:"get" tags:"Assignment" summary:"get assignment info"`
	AssignmentId int64 `v:"required" dc:"id of the assignment to find"`
}

type GetAssignmentRes struct {
	g.Meta     `mime:"text/html" example:"json"`
	Assignment *entity.Assignments `json:"assignment" dc:"info of the assignment"`
}

type DeleteAssignmentReq struct {
	g.Meta       `path:"/api/assignment/deleteAssignment" method:"delete" tags:"Assignment" summary:"delete assignment info"`
	AssignmentId int64 `v:"required" dc:"id of the assignment to delete"`
	CourseId     int64 `v:"required" dc:"id of the course"`
	UserId       int64 `json:"userId" v:"required" dc:"id of the user who want to delete this assignment"`
}

type DeleteAssignmentRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type UpdateAssignmentReq struct {
	g.Meta           `path:"/api/assignment/updateAssignment" method:"put" tags:"Assignment" summary:"update assignment"`
	UpdateAssignment AssignmentInfo `json:"assignment" dc:"Info of the assignment to update"`
	UserId           int64          `json:"userId" v:"required" dc:"id of the user who want to update this assignment"`
}

type UpdateAssignmentRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type UploadTestcaseAndAnswerReq struct {
	g.Meta            `path:"/api/assignment/uploadTestcaseAndAnswer" method:"post" tags:"Assignment" summary:"update testcase and answer for this assignment"`
	TestcaseAndAnswer TestcaseAndAnswerInfo `json:"testcaseAndAnswer" dc:"Info of the testcase and answer"`
	CourseId          int64                 `v:"required" dc:"id of the course"`
}

type UploadTestcaseAndAnswerRes struct {
	g.Meta              `mime:"text/html" example:"json"`
	TestcaseAndAnswerId int64 `json:"testcaseAndAnswerId" dc:"id of this testcase and answer"`
}

type DeleteTestcaseAndAnswerReq struct {
	g.Meta              `path:"/api/assignment/deleteTestcaseAndAnswer" method:"delete" tags:"Assignment" summary:"delete testcase and answer"`
	TestcaseAndAnswerId int64 `json:"testcaseAndAnswerId" dc:"Id of the testcase and answer"`
	UserId              int64 `v:"required" dc:"id of the user who want to delete the testcase"`
	CourseId            int64 `v:"required" dc:"id of the course"`
}

type DeleteTestcaseAndAnswerRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type AttemptForAssignmentReq struct {
	g.Meta                `path:"/api/assignment/attemptAssignment" method:"post" tags:"Assignment" summary:"attempt assignment"`
	AssignmentUserAttempt AttemptForAssignment `json:"attempt" dc:"Info of the attempt for this assignment"`
}

type AttemptForAssignmentRes struct {
	g.Meta                 `mime:"text/html" example:"json"`
	AssignmentUserFeedback FeedbackForAssignmentInfo `json:"feedback" dc:"Info of the feedback for this attempt"`
}

type GetAssignmentFeedbackOfAUserReq struct {
	g.Meta       `path:"/api/assignment/getAssignmentFeedbackOfAUser" method:"get" tags:"Assignment" summary:"attempt assignment"`
	UserId       int64 `json:"userId" dc:"Id of the user want to search for feedback"`
	AssignmentId int64 `v:"required" dc:"id of the assignment to get"`
}

type GetAssignmentFeedbackOfAUserRes struct {
	g.Meta    `mime:"text/html" example:"json"`
	Feedbacks []*entity.AssignmentUserFeedback `json:"feedback" dc:"Info of the feedback for this assignment"`
}
