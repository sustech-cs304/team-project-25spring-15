package runner

import (
	"context"
	v1 "intelligent-course-aware-ide/api/runner/v1"
	"intelligent-course-aware-ide/internal/consts"
	"os/exec"
	"strings"
)

func (r *Runners) RunCCode(ctx context.Context, codeInfo *v1.RunnerReq, pathForCDocker string, pathForExecutableFile string) (codeFeedback *v1.RunnerRes, err error) {
	var cmd *exec.Cmd
	var compileInfo, compileErr string
	var stdout, stderr strings.Builder

	cmd = exec.CommandContext(ctx, "docker", "exec", consts.TargetCDockerName, "g++", pathForCDocker, "-o", pathForExecutableFile)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	cmd.Run()

	compileInfo = stdout.String()
	compileErr = stderr.String()
	if compileInfo != "" || compileErr != "" {
		codeFeedback = &v1.RunnerRes{
			Result:   compileInfo,
			Error:    compileErr,
			FilePath: "",
		}

		return codeFeedback, err
	}

	stdout.Reset()
	stderr.Reset()

	cmdStr2 := pathForExecutableFile
	if codeInfo.Args != nil {
		for _, arg := range codeInfo.Args {
			cmdStr2 += " " + arg
		}
	} else {
		if codeInfo.InputPath != "" {
			cmdStr2 += " < " + codeInfo.InputPath
		}
		if codeInfo.OutputPath != "" {
			cmdStr2 += " > " + codeInfo.OutputPath
		}
	}

	var cmdContext []string = []string{
		"exec", consts.TargetCDockerName, cmdStr2,
	}

	cmd = exec.CommandContext(ctx, "docker", cmdContext...)
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
