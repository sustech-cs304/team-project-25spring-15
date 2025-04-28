// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package ai

import (
	"context"

	"intelligent-course-aware-ide/api/ai/v1"
)

type IAiV1 interface {
	AskForAi(ctx context.Context, req *v1.AskForAiReq) (res *v1.AskForAiRes, err error)
}
