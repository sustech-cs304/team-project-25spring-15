package ai

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gtime"
	"github.com/gogf/gf/v2/test/gtest"
	"github.com/google/uuid"

	v1 "intelligent-course-aware-ide/api/ai/v1"
	"intelligent-course-aware-ide/internal/dao"

	_ "github.com/gogf/gf/contrib/drivers/sqlite/v2"
)

// Test_StoreMessage verifies that storing a chat history record works correctly.
func Test_StoreMessage(t *testing.T) {
	gtest.C(t, func(t *gtest.T) {
		chatId := uuid.New().String()
		createAt := gtime.New(time.Now())

		req := &v1.StoreMessageReq{
			StoreHistoryItem: v1.StoreHistoryItem{
				ChatId:    chatId,
				LectureId: 1001,
				UserId:    2002,
				Role:      "user",
				Parts:     "Hello, this is a test message.",
				CreateAt:  createAt.Time,
			},
		}

		ctrl := &ControllerV1{}
		res, err := ctrl.StoreMessage(context.Background(), req)
		t.AssertNil(err)
		t.AssertNE(res, nil)

		count, err := dao.AIChatHistory.Ctx(context.Background()).
			Where("chatId", chatId).
			Count()
		t.AssertNil(err)
		t.Assert(count, 1)
	})
}

// Test_StoreHistories verifies batch insertion of chat history records.
func Test_StoreHistories(t *testing.T) {
	gtest.C(t, func(t *gtest.T) {
		chatGroup := uuid.New().String()
		now := gtime.New(time.Now())
		items := make([]v1.StoreHistoryItem, 0, 3)
		for i := 0; i < 3; i++ {
			items = append(items, v1.StoreHistoryItem{
				ChatId:    chatGroup,
				LectureId: int64(1000 + i),
				UserId:    int64(2000 + i),
				Role:      "user",
				Parts:     fmt.Sprintf("Message %d", i+1),
				CreateAt:  now.Time,
			})
		}
		req := &v1.StoreHistoriesReq{Data: items}

		ctrl := &ControllerV1{}
		res, err := ctrl.StoreHistories(context.Background(), req)
		t.AssertNil(err)
		t.AssertNE(res, nil)

		count, err := dao.AIChatHistory.Ctx(context.Background()).
			Where("chatId", chatGroup).
			Count()
		t.AssertNil(err)
		t.Assert(count, len(items))
	})
}

// Test_GetHistories verifies retrieval of stored chat history entries in order.
func Test_GetHistories(t *testing.T) {
	gtest.C(t, func(t *gtest.T) {
		chatGroup := uuid.New().String()
		now := gtime.New(time.Now())
		// Insert three history items
		for i := 0; i < 3; i++ {
			_, err := dao.AIChatHistory.Ctx(context.Background()).
				Data(g.Map{
					"chatId":    chatGroup,
					"lectureId": int64(500 + i),
					"userId":    int64(600 + i),
					"role":      "assistant",
					"parts":     fmt.Sprintf("Reply %d", i+1),
					"createAt":  now.Add(time.Duration(i) * time.Second),
				}).
				Insert()
			t.AssertNil(err)
		}

		// Fetch for a specific lectureId and userId (use the first inserted)
		req := &v1.GetHistoriesReq{
			LectureId: 500,
			UserId:    600,
		}
		ctrl := &ControllerV1{}
		res, err := ctrl.GetHistories(context.Background(), req)
		t.AssertNil(err)
		t.Assert(len(res.Data), 1)
		t.Assert(res.Data[0].Parts, "Reply 1")
	})
}

// Test_ClearHistories verifies that clearing chat history removes all entries.
func Test_ClearHistories(t *testing.T) {
	gtest.C(t, func(t *gtest.T) {
		chatGroup := uuid.New().String()
		now := gtime.New(time.Now())
		lectureId := int64(800)
		userId := int64(900)
		// Insert two history items
		for i := 0; i < 2; i++ {
			_, err := dao.AIChatHistory.Ctx(context.Background()).
				Data(g.Map{
					"chatId":    chatGroup,
					"lectureId": lectureId,
					"userId":    userId,
					"role":      "user",
					"parts":     fmt.Sprintf("Msg %d", i+1),
					"createAt":  now,
				}).
				Insert()
			t.AssertNil(err)
		}

		// Clear all for this lecture and user
		req := &v1.ClearHistoriesReq{LectureId: lectureId, UserId: userId}
		ctrl := &ControllerV1{}
		res, err := ctrl.ClearHistories(context.Background(), req)
		t.AssertNil(err)
		t.AssertNE(res, nil)

		// Verify deletion
		count, err := dao.AIChatHistory.Ctx(context.Background()).
			Where("lectureId", lectureId).
			Where("userId", userId).
			Count()
		t.AssertNil(err)
		t.Assert(count, 0)
	})
}
