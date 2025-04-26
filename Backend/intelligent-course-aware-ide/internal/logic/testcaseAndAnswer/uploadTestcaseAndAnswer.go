package testcaseAndAnswer

import (
	"context"
	assignmentv1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/dao"
)

func (t *TestcaseAndAnswers) UploadTestcaseAndAnswer(ctx context.Context, testcaseInfo *assignmentv1.TestcaseAndAnswerInfo) (testcaseAndAnswerId int64, err error) {
	testcaseAndAnswerId, err = dao.TestcaseAndAnswerFiles.Ctx(ctx).Data(&testcaseInfo).InsertAndGetId()
	return testcaseAndAnswerId, err
}
