package command2

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "intelligent-course-aware-ide/api/command2/v1"
	"intelligent-course-aware-ide/internal/consts"
)

func (c *ControllerV1) CloseShell(ctx context.Context, req *v1.CloseShellReq) (res *v1.CloseShellRes, err error) {
	requestBody := map[string]interface{}{
		"sessionId": req.SessionId,
	}
	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return nil, gerror.NewCode(gcode.CodeInternalError, "Failed to marshal request body")
	}
	resp, err := http.Post(consts.TargetUrl+"/bash/close", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, gerror.NewCode(gcode.CodeInternalError, "Failed to send request to runner service")
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, gerror.NewCode(gcode.CodeInternalError, "Failed to read response body")
	}
	if resp.StatusCode != http.StatusOK {
		return nil, gerror.NewCode(gcode.CodeInternalError, string(body))
	}

	var resResult v1.CloseShellRes
	err = json.Unmarshal(body, &resResult)
	if err != nil {
		return nil, gerror.NewCode(gcode.CodeInternalError, "Failed to unmarshal response body")
	}
	return &resResult, nil
}
