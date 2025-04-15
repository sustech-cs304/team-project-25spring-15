package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *ControllerV1) GetAllCoursesInfo(ctx context.Context, req *v1.GetAllCoursesInfoReq) (res *v1.GetAllCoursesInfoRes, err error) {
	var courses []*entity.Courses
	err = dao.Courses.Ctx(ctx).Scan(&courses)
	if err != nil {
		return nil, err
	}

	res = &v1.GetAllCoursesInfoRes{}
	for _, course := range courses {
		var lectures []*entity.Lectures
		err = dao.Lectures.Ctx(ctx).Where("courseId", course.CourseId).Scan(&lectures)
		if err != nil {
			return nil, err
		}
		var lectureInfos []v1.LectureInfo
		for _, lecture := range lectures {
			lectureInfos = append(lectureInfos, v1.LectureInfo{
				LectureId:         int64(lecture.LectureId),
				LecutureName:      lecture.LectureName,
				CourseDescription: lecture.DescriptionL,
			})
		}
		res.Courses = append(res.Courses, v1.CourseInfo{
			CourseId:          course.CourseId,
			CourseName:        course.CourseName,
			CourseDescription: course.DescriptionC,
			Lectures:          lectureInfos,
		})
	}
	return
}
