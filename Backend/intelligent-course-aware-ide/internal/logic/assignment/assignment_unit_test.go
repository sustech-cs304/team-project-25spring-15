package assignment

import (
	"context"
	assignmentv1 "intelligent-course-aware-ide/api/assignment/v1"
	runnerLogic "intelligent-course-aware-ide/internal/logic/runner"
	"intelligent-course-aware-ide/internal/model/entity"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/stretchr/testify/assert"
)

func TestNew(t *testing.T) {
	answer := &Assignments{}
	result := New()
	assert.Equal(t, answer, result)
}

func TestCheckAnswer(t *testing.T) {
	testcaseTestcaseAndAnswerFile1 := entity.TestcaseAndAnswerFiles{
		TestcaseAndAnswerId: 1,
		AssignmentId:        1,
		PublisherId:         1,
		TestcaseId:          999,
		AnswerId:            2,
		Score:               1,
	}
	testcaseTestcaseAndAnswerFile2 := entity.TestcaseAndAnswerFiles{
		TestcaseAndAnswerId: 1,
		AssignmentId:        1,
		PublisherId:         1,
		TestcaseId:          1,
		AnswerId:            999,
		Score:               1,
	}
	testcaseTestcaseAndAnswerFile3 := entity.TestcaseAndAnswerFiles{
		TestcaseAndAnswerId: 1,
		AssignmentId:        1,
		PublisherId:         1,
		TestcaseId:          1,
		AnswerId:            2,
		Score:               1,
	}

	testcaseAttemptForAssignment1 := assignmentv1.AttemptForAssignment{
		UserId:       1,
		FileId:       1,
		FileType:     "test",
		AssignmentId: 1,
	}

	testcaseCodeFile1 := entity.Files{
		FileUrl: "test/test.test",
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	testAssignment := New()
	testRunner := runnerLogic.New()
	var cnt1, cnt2 int
	var err error
	cnt1, cnt2, err = testAssignment.CheckAnswer(ctx, testRunner, &testcaseAttemptForAssignment1, &testcaseCodeFile1, &testcaseTestcaseAndAnswerFile1, 0, 0)
	t.Log("1", cnt1, cnt2, err)
	assert.Equal(t, 0, cnt1)
	assert.Equal(t, 0, cnt2)

	cnt1, cnt2, err = testAssignment.CheckAnswer(ctx, testRunner, &testcaseAttemptForAssignment1, &testcaseCodeFile1, &testcaseTestcaseAndAnswerFile2, 0, 0)
	t.Log("2", cnt1, cnt2, err)
	assert.Equal(t, 0, cnt1)
	assert.Equal(t, 0, cnt2)

	cnt1, cnt2, err = testAssignment.CheckAnswer(ctx, testRunner, &testcaseAttemptForAssignment1, &testcaseCodeFile1, &testcaseTestcaseAndAnswerFile3, 0, 0)
	t.Log("3", cnt1, cnt2, err)
	assert.Equal(t, 0, cnt1)
	assert.Equal(t, 1, cnt2)
}
