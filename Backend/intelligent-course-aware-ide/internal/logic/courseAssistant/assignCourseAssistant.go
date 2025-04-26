package courseassistant

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *CourseAssistants) AssignCourseAssistant(ctx context.Context, courseId int64, assistantId int64) error {
	_, err := dao.CourseAssistants.Ctx(ctx).Data(do.CourseAssistants{
		CourseId:    courseId,
		AssistantId: assistantId,
	}).Insert()
	return err
}
