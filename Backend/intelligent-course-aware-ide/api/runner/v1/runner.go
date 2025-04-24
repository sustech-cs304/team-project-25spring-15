package v1

import (
	"github.com/gogf/gf/v2/frame/g"
)

type RunnerReq struct {
	Code string   `json:"code" v:"required" dc:"code to run"`
	Args []string `json:"args" dc:"Arguments to pass to the script"`
	Name string   `json:"name" d:"temp_script" dc:"FileName"`
}

type RunnerRes struct {
	Result   string `json:"result" dc:"Result of the code execution"`
	Error    string `json:"error" dc:"Error message if any"`
	FilePath string `json:"filePath" dc:"Path to the temporary file"`
}

type GeneralRunnerReq struct {
	g.Meta   `path:"/api/codeRunner/run" method:"post" tags:"CodeRunner" summary:"Run code"`
	CodeInfo RunnerReq `json:"codeInfo" dc:"Info of the code to run"`
	CodeType string    `json:"type" dc:"type of the code to run"`
}

type GeneralRunnerRes struct {
	g.Meta       `mime:"text/html" example:"json"`
	CodeFeedback *RunnerRes `json:"codeFeedback" dc:"Feedback of the code to run"`
}
