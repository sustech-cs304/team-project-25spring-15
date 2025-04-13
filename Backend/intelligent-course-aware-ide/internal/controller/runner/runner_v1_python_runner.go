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

func (c *ControllerV1) PythonRunner(ctx context.Context, req *v1.PythonRunnerReq) (res *v1.PythonRunnerRes, err error) {
	var name string = req.Name
	// Check if the Docker container is running
	var checkResult string = CheckWhetherContainerIsRunning(TargetPythonDockerName)
	if checkResult != "success" {
		return nil, gerror.NewCode(gcode.CodeDbOperationError, checkResult)
	}

	// Create a temporary file to store the Python code
	// Write the code into the file
	var pathForPythonHost string = PathForHost + name + ".py"
	if err := os.WriteFile(pathForPythonHost, []byte(req.Code), 0644); err != nil {
		return nil, gerror.Wrap(err, "Fail to write")
	}

	// Here we use new path to replace the ordinary path
	// But we have not implement file upload so we will implement it later
	var pathForPythonDocker string = PathForDocker + name + ".py"
	var cmdContext []string = append([]string{
		"exec", "-i", TargetPythonDockerName, "python", pathForPythonDocker,
	}, req.Args...)

	var cmd *exec.Cmd = exec.CommandContext(ctx, "docker", cmdContext...)

	var stdout, stderr strings.Builder
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	cmd.Run()

	res = &v1.PythonRunnerRes{
		RunnerRes: v1.RunnerRes{
			Result:   stdout.String(),
			Error:    stderr.String(),
			FilePath: "",
		},
	}

	return
}
