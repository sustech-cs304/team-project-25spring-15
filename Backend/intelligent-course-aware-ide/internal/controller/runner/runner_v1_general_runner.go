package runner

import (
	"context"
	"errors"

	v1 "intelligent-course-aware-ide/api/runner/v1"
)

func (c *ControllerV1) GeneralRunner(ctx context.Context, req *v1.GeneralRunnerReq) (res *v1.GeneralRunnerRes, err error) {
	res = &v1.GeneralRunnerRes{}
	if req.CodeType == "c" || req.CodeType == "c++" || req.CodeType == "cpp" {
		res.CodeFeedback, err = CCodeRunner(ctx, &req.CodeInfo)
	} else if req.CodeType == "python" {
		res.CodeFeedback, err = PythonCodeRunner(ctx, &req.CodeInfo)
	} else {
		err = errors.New("only c/cpp and python are support to run")
	}
	return res, err
}
