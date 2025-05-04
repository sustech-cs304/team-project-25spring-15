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
	var compileErr string
	var stdout, stderr strings.Builder

	cmdStr1 := "g++ " + pathForCDocker + " -o " + pathForExecutableFile
	cmd = exec.CommandContext(ctx, "docker", "exec", consts.TargetCDockerName, cmdStr1)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	cmd.Run()

	compileErr = stderr.String()
	if compileErr != "" {
		codeFeedback = &v1.RunnerRes{
			Result:   stdout.String(),
			Error:    compileErr,
			FilePath: "",
		}

		return codeFeedback, err
	}

	stdout.Reset()
	stderr.Reset()

	cmdStr2 := "pathForExecutableFile"
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
		"exec", "-it", consts.TargetCDockerName, "bash", "-c", cmdStr2,
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
