package assignment

import (
	"context"

	v1 "intelligent-course-aware-ide/api/assignment/v1"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (c *ControllerV1) AttemptForAssignment(ctx context.Context, req *v1.AttemptForAssignmentReq) (res *v1.AttemptForAssignmentRes, err error) {
	var codeFile *entity.Files
	var testcaseAndAnswerList []*entity.TestcaseAndAnswerFiles
	codeFile, err = c.files.GetFileWithFileId(ctx, req.AssignmentUserAttempt.FileId)
	if err != nil {
		return nil, err
	}
	testcaseAndAnswerList, err = c.testcaseAndAnswers.GetTestcaseAndAnswerWithAssignmentId(ctx, req.AssignmentUserAttempt.AssignmentId)
	if err != nil {
		return nil, err
	}

	var score float32 = 0
	var count, totalCount int = 0, 0
	for _, testcaseAndAnswerFile := range testcaseAndAnswerList {
		count, totalCount, err = c.assignments.CheckAnswer(ctx, &req.AssignmentUserAttempt, codeFile, testcaseAndAnswerFile, count, totalCount)
		if err != nil {
			return nil, err
		}
	}

	if count != 0 {
		score = (float32(count) / float32(totalCount)) * 100
	}

	res = &v1.AttemptForAssignmentRes{
		AssignmentUserFeedback: v1.FeedbackForAssignmentInfo{
			AssignmentId: req.AssignmentUserAttempt.AssignmentId,
			PerformerId:  req.AssignmentUserAttempt.UserId,
			Score:        int(score),
			FileId:       req.AssignmentUserAttempt.FileId,
			FileType:     req.AssignmentUserAttempt.FileType,
		},
	}

	return res, err
}
