package runner

import (
	"context"
	v1 "intelligent-course-aware-ide/api/runner/v1"
	"intelligent-course-aware-ide/internal/consts"
	"os"

	"github.com/gogf/gf/v2/errors/gerror"
)

func (r *Runners) PythonCodeRunner(ctx context.Context, codeInfo *v1.RunnerReq) (pathForPythonDocker string, err error) {
	var name string = codeInfo.Name

	// Create a temporary file to store the Python code
	// Write the code into the file
	var pathForPythonHost string = consts.PathForHost + name + ".py"
	if err := os.WriteFile(pathForPythonHost, []byte(codeInfo.Code), 0644); err != nil {
		return "", gerror.Wrap(err, "Fail to write")
	}

	// Here we use new path to replace the ordinary path
	// But we have not implement file upload so we will implement it later
	pathForPythonDocker = consts.PathForDocker + name + ".py"

	return pathForPythonDocker, err
}
