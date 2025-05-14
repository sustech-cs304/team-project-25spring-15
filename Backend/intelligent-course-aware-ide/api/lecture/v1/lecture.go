package v1

import (
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
)

type LectureInfo struct {
	CourseId    int64  `json:"courseId" dc:"id of this course"`
	LectureId   int64  `json:"lectureId" dc:"id of this lecture"`
	LectureName string `json:"lectureName" dc:"name of this lecture"`
	Description string `json:"description" dc:"description of this lecture"`
}

type GetAllLectureOfACourseInfoReq struct {
	g.Meta   `path:"/api/lecture/getLectures/{courseId}" method:"get" tags:"Lecture" summary:"get info of all courses"`
	CourseId int64 `json:"courseId" dc:"Id of this course"`
}

type GetAllLectureOfACourseInfoRes struct {
	g.Meta   `mime:"text/html" example:"json"`
	Lectures []*entity.Lectures `json:"lectures" dc:"Info of all lectures of the course"`
}

type CreateLectureReq struct {
	g.Meta     `path:"/api/lecture/createLecture" method:"post" tags:"Lecture" summary:"create lecture"`
	NewLecture LectureInfo `json:"lecture" dc:"Info of the lecture to create"`
	ChatId     int64       `json:"chatId" dc:"chat id of this course"`
}

type CreateLectureRes struct {
	g.Meta    `mime:"text/html" example:"json"`
	LectureId int64 `json:"lectureId" dc:"id of the new lecture"`
}

type GetLectureReq struct {
	g.Meta    `path:"/api/lecture/searchLecture/{lectureId}" method:"get" tags:"Lecture" summary:"get lecture info"`
	LectureId int64 `v:"required" dc:"id of the lecture to find"`
}

type GetLectureRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Lecture *entity.Lectures `json:"lecture" dc:"info of the lecture"`
}

type DeleteLectureReq struct {
	g.Meta      `path:"/api/lecture/deleteLecture" method:"delete" tags:"Lecture" summary:"delete lecture info"`
	LectureId   int64  `v:"required" dc:"id of the lecture to delete"`
	CourseId    int64  `v:"required" dc:"id of the course"`
	LectureName string `dc:"name of the lecture to delete"`
	ChatId      int64  `json:"chatId" dc:"chat id of this course"`
}

type DeleteLectureRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}

type UpdateLectureReq struct {
	g.Meta        `path:"/api/lecture/updateLecture" method:"put" tags:"Lecture" summary:"update lecture"`
	UpdateLecture LectureInfo `json:"lecture" dc:"Info of the lecture to update"`
	ChatId        int64       `json:"chatId" dc:"chat id of this course"`
}

type UpdateLectureRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}
