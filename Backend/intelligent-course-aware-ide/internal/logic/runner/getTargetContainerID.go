package runner

import (
	"bytes"
	"fmt"
	"intelligent-course-aware-ide/internal/consts"
	"os/exec"
	"strings"
)

func (r *Runners) GetTargetContainerID(codeType string) (dockerId string, err error) {
	var imageName string = "ancestor="
	if codeType == "c" || codeType == "c++" || codeType == "cpp" {
		imageName += consts.TargetCDockerName
	} else if codeType == "python" {
		imageName += consts.TargetPythonDockerName
	} else {
		imageName += consts.TargetDockerName
	}

	cmd := exec.Command("docker", "ps", "-q", "--filter", imageName)
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err = cmd.Run()
	if err != nil {
		return "", fmt.Errorf("failed to run docker ps: %v\nstderr: %s\nstdout: %s", err, stderr.String(), stdout.String())
	}

	lines := strings.Split(stdout.String(), "\n")
	for _, line := range lines {
		if trimmed := strings.TrimSpace(line); trimmed != "" {
			return trimmed, nil
		}
	}

	// 即使 cmd 成功执行了，如果输出为空，也提示 stderr 和 stdout 内容以便调试
	return "", fmt.Errorf("no container found for image: %s\nstderr: %s\nstdout: %s", imageName, stderr.String(), stdout.String())
}
