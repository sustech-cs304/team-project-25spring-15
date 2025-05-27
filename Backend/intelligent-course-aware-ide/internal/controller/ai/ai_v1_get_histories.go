package ai

import (
	"context"

	v1 "intelligent-course-aware-ide/api/ai/v1"
	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
)

// GetHistories fetches all chat history entries for a given lecture and user.
func (c *ControllerV1) GetHistories(ctx context.Context, req *v1.GetHistoriesReq) (res *v1.GetHistoriesRes, err error) {
	res = &v1.GetHistoriesRes{}

	var items []v1.StoreHistoryItem

	err = dao.AIChatHistory.
		Ctx(ctx).
		Where("lectureId", req.LectureId).
		Where("userId", req.UserId).
		Order("createAt asc").
		Scan(&items)
	if err != nil {
		err = gerror.WrapCode(gcode.CodeInternalError, err, "failed to query chat histories")
		return
	}

	res.Data = items
	return
}
