package example

import (
	"context"

	v1 "intelligent-course-aware-ide/api/example/v1"
)

func (c *ControllerV1) Example(ctx context.Context, req *v1.ExampleReq) (res *v1.ExampleRes, err error) {
	res = &v1.ExampleRes{
		Result: "Success",
	}
	return
}
