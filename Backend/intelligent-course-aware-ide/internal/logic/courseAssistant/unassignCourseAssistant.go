package courseassistant

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/do"
)

func (c *CourseAssistants) UnassignCourseAssistant(ctx context.Context, courseId int64, assistantId int64) error {
	_, err := dao.CourseAssistants.Ctx(ctx).Where(do.CourseAssistants{
		CourseId:    courseId,
		AssistantId: assistantId,
	}).Delete()
	return err
}
