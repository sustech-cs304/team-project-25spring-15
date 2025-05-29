package assignment

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"
)

func (a *Assignments) GetTotalScoreOfAssignments(ctx context.Context, assignments []*entity.Assignments) (totalScores []int, err error) {
	if assignments == nil {
		return totalScores, err
	}
	for _, assignment := range assignments {
		totalScore, err := dao.TestcaseAndAnswerFiles.Ctx(ctx).Where("assignmentId", assignment.AssignmentId).Sum("score")
		if err != nil {
			return totalScores, err
		}
		totalScores = append(totalScores, int(totalScore))
	}
	return totalScores, nil
}
