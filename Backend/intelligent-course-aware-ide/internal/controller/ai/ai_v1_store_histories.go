package ai

import (
	"context"

	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"

	v1 "intelligent-course-aware-ide/api/ai/v1"
)

func (c *ControllerV1) StoreHistories(ctx context.Context, req *v1.StoreHistoriesReq) (res *v1.StoreHistoriesRes, err error) {
	// Initialize response
	res = &v1.StoreHistoriesRes{}

	// Begin a new transaction
	tx, err := g.DB().Begin(ctx)
	if err != nil {
		return nil, gerror.WrapCode(gcode.CodeInternalError, err, "failed to start transaction")
	}
	// Ensure rollback on error
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	insertedCount := 0

	// Iterate over each history item and insert
	for _, item := range req.Data {
		// Insert into ai_chat_history table
		if _, err = dao.AIChatHistory.
			Ctx(ctx).
			TX(tx).
			Data(g.Map{
				"chatId":    item.ChatId,
				"lectureId": item.LectureId,
				"userId":    item.UserId,
				"role":      item.Role,
				"parts":     item.Parts,
				"createAt":  item.CreateAt,
			}).
			Insert(); err != nil {
			err = gerror.WrapCode(gcode.CodeInternalError, err, "failed to insert chat history")
			return
		}
		insertedCount++
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		return nil, gerror.WrapCode(gcode.CodeInternalError, err, "failed to commit transaction")
	}

	return res, nil
}
