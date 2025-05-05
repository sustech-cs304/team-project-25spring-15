package runner

import (
	"context"
	v1 "intelligent-course-aware-ide/api/runner/v1"
	"intelligent-course-aware-ide/internal/consts"
	"os"

	"github.com/gogf/gf/v2/errors/gerror"
)

func (r *Runners) CCodeRunner(ctx context.Context, codeInfo *v1.RunnerReq) (pathForCDocker string, pathForExecutableFile string, err error) {
	var name string = codeInfo.Name

	var pathForCHost string = consts.PathForHost + name + ".cpp"
	if err := os.WriteFile(pathForCHost, []byte(codeInfo.Code), 0644); err != nil {
		return "", "", gerror.Wrap(err, "Fail to write")
	}

	pathForCDocker = consts.PathForDocker + name + ".cpp"
	pathForExecutableFile = consts.PathForDocker + name

	return pathForCDocker, pathForExecutableFile, err
}
