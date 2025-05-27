package ai

import (
	"context"

	"intelligent-course-aware-ide/internal/dao"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"

	v1 "intelligent-course-aware-ide/api/ai/v1"
)

// StoreMessage stores a single chat history record into ai_chat_history.
func (c *ControllerV1) StoreMessage(ctx context.Context, req *v1.StoreMessageReq) (res *v1.StoreMessageRes, err error) {
	// Initialize empty response
	res = &v1.StoreMessageRes{}

	// Prepare data map from request
	data := g.Map{
		"chatId":    req.ChatId,    // unique UUID
		"lectureId": req.LectureId, // foreign key to Lectures
		"userId":    req.UserId,    // foreign key to Users
		"role":      req.Role,      // e.g. "user" or "assistant"
		"parts":     req.Parts,     // message content
		"createAt":  req.CreateAt,  // timestamp
	}

	// Insert the record
	if _, err = dao.AIChatHistory.
		Ctx(ctx).
		Data(data).
		Insert(); err != nil {
		// wrap with internal error code
		err = gerror.WrapCode(gcode.CodeInternalError, err, "failed to insert chat history")
		return
	}

	// Return empty success response
	return
}
