package v1

import (
	"time"

	"github.com/gogf/gf/v2/frame/g"
)

type AskForAiReqInfos struct {
	Question string `json:"question" dc:"question for ai"`
	Type     string `json:"type" dc:"type of this question"`
}

type AskForAiResInfos struct {
	Answer string `json:"answer" dc:"answer of ai"`
	Type   string `json:"type" dc:"type of this question"`
}

type AskForAiReq struct {
	g.Meta          `path:"/api/ai/ask" method:"post" tags:"AI" summary:"ask ai"`
	UserId          int64            `json:"userId" dc:"Id of the user"`
	AskForAiReqInfo AskForAiReqInfos `json:"askForAiReqInfo" dc:"Info of this question"`
}

type AskForAiRes struct {
	g.Meta          `mime:"text/html" example:"json"`
	AskForAiResInfo AskForAiResInfos `json:"askForAiResInfo" dc:"Info of this answer"`
}

type StoreHistoryItem struct {
	ChatId    string    `json:"chatId"    v:"required"`  // Unique UUID for the chat
	LectureId int64     `json:"lectureId" v:"required"`  // Lecture foreign key
	UserId    int64     `json:"userId"    v:"required"`  // User foreign key
	Role      string    `json:"role"`                    // e.g. "user" or "assistant"
	Parts     string    `json:"parts"      v:"required"` // The message content
	CreateAt  time.Time `json:"createAt"`                // Timestamp
}

type StoreHistoriesReq struct {
	g.Meta `path:"/api/ai/chat/history/store" method:"post" tags:"AI" summary:"Store chat histories in batch"`
	Data   []StoreHistoryItem `json:"data" v:"required"`
}

type StoreHistoriesRes struct {
}

type StoreMessageReq struct {
	g.Meta           `path:"/api/ai/chat/message/store" method:"post" tags:"AI" summary:"Store chat histories in batch"`
	StoreHistoryItem `json:"data" v:"required"`
}

type StoreMessageRes struct {
}

type GetHistoriesReq struct {
	g.Meta    `path:"/api/ai/chat/history/get" method:"get" tags:"AI" summary:"Get chat histories in batch"`
	LectureId int64 `v:"required" dc:"an unique lecture id"`
	UserId    int64 `v:"required" dc:"an unique user id"`
}

type GetHistoriesRes struct {
	Data []StoreHistoryItem `json:"data" dc:"Required History"`
}

type ClearHistoriesReq struct {
	g.Meta    `path:"/api/ai/chat/history/clear" method:"post" tags:"AI" summary:"Clear chat histories in batch"`
	LectureId int64 `v:"required" dc:"an unique lecture id"`
	UserId    int64 `v:"required" dc:"an unique user id"`
}

type ClearHistoriesRes struct {
}
