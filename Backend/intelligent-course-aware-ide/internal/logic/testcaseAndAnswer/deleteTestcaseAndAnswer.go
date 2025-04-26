package testcaseAndAnswer

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
)

func (t *TestcaseAndAnswers) DeleteTestcaseAndAnswer(ctx context.Context, testcaseAndAnswerId int64) error {
	_, err := dao.TestcaseAndAnswerFiles.Ctx(ctx).WherePri(testcaseAndAnswerId).Delete()
	return err
}
