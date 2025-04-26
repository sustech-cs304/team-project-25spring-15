package testcaseAndAnswer

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (t *TestcaseAndAnswers) GetTestcaseAndAnswerWithAssignmentId(ctx context.Context, assignmentId int64) (testcaseAndAnswers []*entity.TestcaseAndAnswerFiles, err error) {
	err = dao.TestcaseAndAnswerFiles.Ctx(ctx).Where("assignmentId", assignmentId).Scan(&testcaseAndAnswers)
	return testcaseAndAnswers, err
}
