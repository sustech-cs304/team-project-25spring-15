package ai_test

import (
	"context"
	"testing"
	"time"

	"github.com/gogf/gf/v2/os/gtime"
	"github.com/gogf/gf/v2/test/gtest"
	"github.com/google/uuid"

	v1 "intelligent-course-aware-ide/api/ai/v1"
	"intelligent-course-aware-ide/internal/controller/ai"
	"intelligent-course-aware-ide/internal/dao"

	_ "github.com/gogf/gf/contrib/drivers/sqlite/v2"
)

var TestItem = []v1.StoreHistoryItem{
	{
		ChatId:    uuid.New().String(),
		LectureId: 1001,
		UserId:    2002,
		Role:      "user",
		Parts:     "Hello, this is a test message.",
		CreateAt:  gtime.New(time.Now()).Time,
	},
}

// Test_StoreMessage verifies that storing a chat history record works correctly.
func Test_StoreMessage(t *testing.T) {
	gtest.C(t, func(t *gtest.T) {
		// Build the request
		req := &v1.StoreMessageReq{
			StoreHistoryItem: TestItem[0],
		}
		chatId := req.StoreHistoryItem.ChatId

		// Invoke the controller
		ctrl := &ai.ControllerV1{}
		res, err := ctrl.StoreMessage(context.Background(), req)
		t.AssertNil(err)
		t.AssertNE(res, nil)

		// Verify that the record was inserted into the database
		count, err := dao.AIChatHistory.Ctx(context.Background()).
			Where("chatId", chatId).
			Count()
		t.AssertNil(err)
		t.Assert(count, 1)
	})
}
