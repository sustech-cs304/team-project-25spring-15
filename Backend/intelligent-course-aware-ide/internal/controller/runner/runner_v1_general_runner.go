package runner

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/runner/v1"
	"intelligent-course-aware-ide/internal/consts"
)

func (c *ControllerV1) GeneralRunner(ctx context.Context, req *v1.GeneralRunnerReq) (res *v1.GeneralRunnerRes, err error) {
	res = &v1.GeneralRunnerRes{}
	if req.CodeInfo.Name == "" {
		req.CodeInfo.Name = consts.TmpFileName
	}
	dockerId, err := c.runners.GetTargetContainerID(req.CodeType)
	if err != nil {
		return res, err
	}
	println(dockerId)
	if req.CodeType == "c" || req.CodeType == "c++" || req.CodeType == "cpp" {
		var pathForCDocker, pathForExecutableFile string
		pathForCDocker, pathForExecutableFile, err = c.runners.CCodeRunner(ctx, &req.CodeInfo)
		if err == nil {
			res.CodeFeedback, err = c.runners.RunCCode(ctx, &req.CodeInfo, dockerId, pathForCDocker, pathForExecutableFile)
		}
	} else if req.CodeType == "python" {
		var pathForPythonDocker string
		pathForPythonDocker, err = c.runners.PythonCodeRunner(ctx, &req.CodeInfo)
		if err == nil {
			res.CodeFeedback, err = c.runners.RunPythonCode(ctx, &req.CodeInfo, dockerId, pathForPythonDocker)
		}
	} else {
		err = errors.New("only c/cpp and python are support to run")
	}
	return res, err
}
