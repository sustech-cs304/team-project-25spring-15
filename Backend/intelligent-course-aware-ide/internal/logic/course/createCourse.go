package course

import (
	"context"
	coursev1 "intelligent-course-aware-ide/api/course/v1"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *Courses) CreateCourse(ctx context.Context, newCourse *coursev1.CourseInfo) (courseId int64, err error) {
	courseId, err = dao.Courses.Ctx(ctx).Data(do.Courses{
		TeacherId:   newCourse.TeacherId,
		CourseName:  newCourse.CourseName,
		Description: newCourse.Description,
		StartTime:   newCourse.StartTime,
		EndTime:     newCourse.EndTime,
	}).InsertAndGetId()
	return courseId, err
}
