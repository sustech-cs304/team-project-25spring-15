package course

import (
	"context"

	v1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *ControllerV1) GetCourseWithLecturesByStudentId(ctx context.Context, req *v1.GetCourseWithLecturesByStudentIdReq) (res *v1.GetCourseWithLecturesByStudentIdRes, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	var courseList []*entity.UserCourseInfo
	res = &v1.GetCourseWithLecturesByStudentIdRes{}
	err = dao.UserCourseInfo.Ctx(ctx).Where("userId", operatorId).Scan(&courseList)
	if err != nil {
		return res, err
	}
	if courseList == nil {
		return res, nil
	}
	for _, studentCourseInfo := range courseList {
		var courseInfo v1.CourseInfoWithLecture
		err = dao.Courses.Ctx(ctx).WherePri(studentCourseInfo.CourseId).Scan(&courseInfo)
		if err != nil {
			return res, err
		}
		err = dao.Lectures.Ctx(ctx).Where("courseId", courseInfo.CourseId).Scan(&courseInfo.Lectures)
		if err != nil {
			return res, err
		}
		res.Courses = append(res.Courses, courseInfo)
	}
	return res, nil
}
