package runner

import (
	"context"
	v1 "intelligent-course-aware-ide/api/runner/v1"
	"intelligent-course-aware-ide/internal/consts"
	"os/exec"
	"strings"
)

func (r *Runners) RunPythonCode(ctx context.Context, codeInfo *v1.RunnerReq, pathForPythonDocker string) (codeFeedback *v1.RunnerRes, err error) {
	// Here we use new path to replace the ordinary path
	// But we have not implement file upload so we will implement it later
	cmdStr := "python " + pathForPythonDocker
	if codeInfo.Args != nil {
		for _, arg := range codeInfo.Args {
			cmdStr += " " + arg
		}
	} else {
		if codeInfo.InputPath != "" {
			cmdStr += " < " + codeInfo.InputPath
		}
		if codeInfo.OutputPath != "" {
			cmdStr += " > " + codeInfo.OutputPath
		}
	}
	var cmdContext []string = []string{
		"exec", consts.TargetPythonDockerName, "bash", "-c", cmdStr,
	}

	var cmd *exec.Cmd = exec.CommandContext(ctx, "docker", cmdContext...)

	var stdout, stderr strings.Builder
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	cmd.Run()
	codeFeedback = &v1.RunnerRes{
		Result:   stdout.String(),
		Error:    stderr.String(),
		FilePath: "",
	}

	return codeFeedback, err
}
