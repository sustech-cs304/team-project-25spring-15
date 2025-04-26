package assignment

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/frame/g"
)

func (a *Assignments) UpdateAssignment(ctx context.Context, info g.Map, assignmentId int64) error {
	_, err := dao.Assignments.Ctx(ctx).Data(info).WherePri(assignmentId).Update()
	return err
}
