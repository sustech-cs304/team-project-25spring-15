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
	StoreHistories(ctx context.Context, req *v1.StoreHistoriesReq) (res *v1.StoreHistoriesRes, err error)
	GetHistories(ctx context.Context, req *v1.GetHistoriesReq) (res *v1.GetHistoriesRes, err error)
	ClearHistories(ctx context.Context, req *v1.ClearHistoriesReq) (res *v1.ClearHistoriesRes, err error)
}
