// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package example

import (
	"context"

	"intelligent-course-aware-ide/api/example/v1"
)

type IExampleV1 interface {
	Example(ctx context.Context, req *v1.ExampleReq) (res *v1.ExampleRes, err error)
}
