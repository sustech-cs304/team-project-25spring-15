package v1

import "github.com/gogf/gf/v2/frame/g"

type CreateShellReq struct {
	g.Meta `path:"/api/command/create" method:"post" tags:"Command" summary:"create a shell"`
}

type CreateShellRes struct {
	g.Meta    `mime:"text/html" example:"json"`
	SessionId string `json:"sessionId" dc:"Id of this Session"`
	Cwd       string `json:"cwd" dc:"cwd"`
	ErrorInfo string `json:"error" dc:"error message"`
}

type ExecCommandReq struct {
	g.Meta    `path:"/api/command/exec" method:"post" tags:"Command" summary:"exec a command"`
	SessionId string `json:"sessionId" dc:"Id of this Session"`
	Command   string `json:"command" dc:"command to run"`
}

type ExecCommandRes struct {
	g.Meta    `mime:"text/html" example:"json"`
	Output    string `json:"output" dc:"output of this command"`
	Cwd       string `json:"cwd" dc:"cwd"`
	ErrorInfo string `json:"error" dc:"error message"`
}

type CloseShellReq struct {
	g.Meta    `path:"/api/command/close" method:"post" tags:"Command" summary:"close a shell"`
	SessionId string `json:"sessionId" dc:"Id of this Session"`
}

type CloseShellRes struct {
	g.Meta    `mime:"text/html" example:"json"`
	ErrorInfo string `json:"error" dc:"error message"`
}
