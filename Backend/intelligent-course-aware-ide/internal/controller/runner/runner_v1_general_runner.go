package runner

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "intelligent-course-aware-ide/api/runner/v1"
	"intelligent-course-aware-ide/internal/consts"
)

func (c *ControllerV1) GeneralRunner(ctx context.Context, req *v1.GeneralRunnerReq) (res *v1.GeneralRunnerRes, err error) {
	requestBody := map[string]interface{}{
		"codeInfo": map[string]interface{}{
			"code":       req.CodeInfo.Code,
			"name":       req.CodeInfo.Name,
			"args":       req.CodeInfo.Args,
			"InputPath":  req.CodeInfo.InputPath,
			"outputPath": req.CodeInfo.OutputPath,
		},
		"type": req.CodeType,
		"dir":  "",
	}
	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return nil, gerror.NewCode(gcode.CodeInternalError, "Failed to marshal request body")
	}
	resp, err := http.Post(consts.TargetUrl+"/run", "application/json", bytes.NewBuffer(jsonData))

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

	var runnerRes v1.GeneralRunnerRes
	err = json.Unmarshal(body, &runnerRes)
	if err != nil {
		return nil, gerror.NewCode(gcode.CodeInternalError, "Failed to unmarshal response body")
	}

	return &runnerRes, nil
}
