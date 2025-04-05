package runner

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"strings"

	"github.com/gogf/gf/v2/errors/gcode"
	"github.com/gogf/gf/v2/errors/gerror"

	v1 "intelligent-course-aware-ide/api/runner/v1"
)

func (c *ControllerV1) PythonRunner(ctx context.Context, req *v1.PythonRunnerReq) (res *v1.PythonRunnerRes, err error) {

	// Check if the Docker container is running
	targetDockerName := "pythonRunner"
	cmd := exec.Command("docker", "ps", "--filter", fmt.Sprintf("name=%s", targetDockerName), "--format", "{{.Names}}")
	output, err := cmd.Output()
	if err != nil {
		print(err)
		return nil, gerror.NewCode(gcode.CodeNotImplemented, fmt.Sprintf("Error checking Docker container: %v", err.Error()))
	}

	dockerNames := strings.Split(strings.TrimSpace(string(output)), "\n")
	hasStarted := false
	for _, dockerName := range dockerNames {
		if targetDockerName == dockerName {
			hasStarted = true
			break
		}
	}

	if !hasStarted {
		// If there is not such a container, create and start a new one
		cmd = exec.Command("docker", "run", "-d", "--name", targetDockerName, "-v", "/tmp:/tmp", "python:3.8-slim")
		_, err = cmd.Output()
	} else {
		// If the container is already exist, just start it
		cmd = exec.Command("docker", "start", targetDockerName)
		_, err = cmd.Output()
	}

	if err != nil {
		print(err)
		return nil, gerror.NewCode(gcode.CodeNotImplemented, fmt.Sprintf("Error starting Docker container: %v", err.Error()))
	}

	// Create a temporary file to store the Python code
	tmpFileName := "temp_script.py"
	path := "C:\\Users\\sunyy\\Desktop\\SUSTECH\\Software_Engineering\\code\\Project\\team-project-25spring-15\\tmp\\" + tmpFileName
	pathForDocker := "/usr/Document/" + tmpFileName
	// Write the code into the file
	if err := os.WriteFile(path, []byte(req.Code), 0644); err != nil {
		return nil, gerror.Wrap(err, "Fail to write")
	}

	// Here we use new path to replace the ordinary path
	// But we have not implement file upload so we will implement it later

	cmdContext := append([]string{
		"exec", "-i", targetDockerName, "python", pathForDocker,
	}, req.Args...)

	cmd = exec.CommandContext(ctx, "docker", cmdContext...)

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
