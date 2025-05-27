package assignment

import (
	"context"
	"intelligent-course-aware-ide/internal/dao"
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/frame/g"
)

func (a *Assignments) GetScoreOfAssignments(ctx context.Context, assignments []*entity.Assignments) (scores []int, err error) {
	operatorId := ctx.Value("operatorId").(int64)
	if assignments == nil {
		return scores, err
	}
	for _, assignment := range assignments {
		var assignmentUserFeedback *entity.AssignmentUserFeedback

		err = dao.AssignmentUserFeedback.Ctx(ctx).Where(g.Map{
			"assignmentId": assignment.AssignmentId,
			"performerId":  operatorId,
		}).OrderDesc("score").Limit(1).Scan(&assignmentUserFeedback)

		if err != nil {
			return scores, err
		}

		if assignmentUserFeedback == nil {
			scores = append(scores, 0)
		} else {
			scores = append(scores, assignmentUserFeedback.Score)
		}
	}
	return scores, nil

}
