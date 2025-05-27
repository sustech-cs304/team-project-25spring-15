package ai

import (
	"context"

	v1 "intelligent-course-aware-ide/api/ai/v1"
	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
)

// ClearHistories deletes all chat history entries for the given lecture and user.
func (c *ControllerV1) ClearHistories(ctx context.Context, req *v1.ClearHistoriesReq) (res *v1.ClearHistoriesRes, err error) {
	res = &v1.ClearHistoriesRes{}

	if _, err = dao.AIChatHistory.
		Ctx(ctx).
		Where("lectureId", req.LectureId).
		Where("userId", req.UserId).
		Delete(); err != nil {
		err = gerror.WrapCode(gcode.CodeInternalError, err, "failed to clear chat histories")
		return
	}

	return
}
