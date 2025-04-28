package v1

import (
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

type GetAllAssignmentInfoOfACourseRes struct {
	g.Meta          `mime:"text/html" example:"json"`
	AskForAiResInfo AskForAiResInfos `json:"askForAiResInfo" dc:"Info of this answer"`
}
