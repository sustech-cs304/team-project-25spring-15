package runner

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/runner/v1"
)

func (c *ControllerV1) GeneralRunner(ctx context.Context, req *v1.GeneralRunnerReq) (res *v1.GeneralRunnerRes, err error) {
	res = &v1.GeneralRunnerRes{}
	if req.CodeType == "c" || req.CodeType == "c++" || req.CodeType == "cpp" {
		var pathForCDocker, pathForExecutableFile string
		pathForCDocker, pathForExecutableFile, err = CCodeRunner(ctx, &req.CodeInfo)
		if err == nil {
			res.CodeFeedback, err = RunCCode(ctx, &req.CodeInfo, pathForCDocker, pathForExecutableFile)
		}
	} else if req.CodeType == "python" {
		var pathForPythonDocker string
		pathForPythonDocker, err = PythonCodeRunner(ctx, &req.CodeInfo)
		if err == nil {
			res.CodeFeedback, err = RunPythonCode(ctx, &req.CodeInfo, pathForPythonDocker)
		}
	} else {
		err = errors.New("only c/cpp and python are support to run")
	}
	return res, err
}
