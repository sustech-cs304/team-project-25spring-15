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

type PythonRunnerReq struct {
	g.Meta `path:"/pythonRunner" method:"get" tags:"PythonRunner" summary:"Run Python code"`
	RunnerReq
}

type PythonRunnerRes struct {
	g.Meta `mime:"text/html" example:"json"`
	RunnerRes
}

type CRunnerReq struct {
	g.Meta `path:"/cRunner" method:"get" tags:"CRunner" summary:"Run C code"`
	RunnerReq
}

type CRunnerRes struct {
	g.Meta `mime:"text/html" example:"json"`
	RunnerRes
}
