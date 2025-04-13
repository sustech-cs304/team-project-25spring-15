package runner

import (
	"context"
	"os"
	"os/exec"
	"strings"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "intelligent-course-aware-ide/api/runner/v1"
)

func (c *ControllerV1) CRunner(ctx context.Context, req *v1.CRunnerReq) (res *v1.CRunnerRes, err error) {
	var name string = req.Name
	var checkResult string = CheckWhetherContainerIsRunning(TargetCDockerName)
	if checkResult != "success" {
		return nil, gerror.NewCode(gcode.CodeInternalError, checkResult)
	}

	var pathForCHost string = PathForHost + name + ".cpp"
	if err := os.WriteFile(pathForCHost, []byte(req.Code), 0644); err != nil {
		return nil, gerror.Wrap(err, "Fail to write")
	}

	var pathForCDocker string = PathForDocker + name + ".cpp"
	var pathForExecutableFile = PathForDocker + name
	var cmd *exec.Cmd
	var compileErr string
	var stdout, stderr strings.Builder

	cmd = exec.CommandContext(ctx, "docker", "exec", TargetCDockerName, "g++", pathForCDocker, "-o", pathForExecutableFile)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	cmd.Run()

	compileErr = stderr.String()
	if compileErr != "" {
		res = &v1.CRunnerRes{
			RunnerRes: v1.RunnerRes{
				Result:   stdout.String(),
				Error:    compileErr,
				FilePath: "",
			},
		}
		return
	}

	var cmdContext []string = append([]string{
		"exec", "-i", TargetCDockerName, pathForExecutableFile,
	}, req.Args...)

	cmd = exec.CommandContext(ctx, "docker", cmdContext...)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	cmd.Run()

	res = &v1.CRunnerRes{
		RunnerRes: v1.RunnerRes{
			Result:   stdout.String(),
			Error:    stderr.String(),
			FilePath: "",
		},
	}
	return
}
