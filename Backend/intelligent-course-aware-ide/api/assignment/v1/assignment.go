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
	Description  string      `json:"startTime" dc:"start time of this course"`
	DeadLine     *gtime.Time `json:"endTime" dc:"end time of this course"`
	Completeness int32       `json:"completeness" dc:"num of the student who has finished this"`
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
	g.Meta        `path:"/api/assignment/createCourse" method:"post" tags:"Assignment" summary:"create course"`
	NewAssignment AssignmentInfo `json:"assignment" dc:"Info of the assignment to create"`
	UserId        int64          `json:"userId" dc:"Id of the user who want to create course"`
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
	g.Meta     `path:"/api/assignment/deleteAssignment" method:"delete" tags:"Assignment" summary:"delete assignment info"`
	Assignment int64 `v:"required" dc:"id of the assignment to delete"`
	UserId     int64 `json:"userId" v:"required" dc:"id of the user who want to delete this assignment"`
}

type DeleteAssignmentRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type UpdateAssignmentReq struct {
	g.Meta           `path:"/api/assignment/updateAssignment" method:"put" tags:"Assignment" summary:"update assignment"`
	UpdateAssignment AssignmentInfo `json:"assignment" dc:"Info of the assignment to update"`
}

type UpdateAssignmentRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}
