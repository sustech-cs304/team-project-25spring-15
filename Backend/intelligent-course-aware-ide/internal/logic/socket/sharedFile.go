package socket

import (
	"context"
	"encoding/json"
	"time"

	"github.com/gogf/gf/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
)

// 处理文件操作
func ProcessFileOperation(ctx context.Context, op OperationMessage) error {
	// 验证操作类型
	switch op.Type {
	case OpTypeInsert, OpTypeDelete, OpTypeUpdate:
		// 将操作保存到数据库
		data := g.Map{
			"fileId":        op.FileId,
			"userId":        op.UserId,
			"operationType": op.Type,
			"position":      op.Position,
			"content":       op.Content,
			"timestamp":     time.Now(),
		}

		if op.IsUndoOp {
			data["isUndoOperation"] = true
			data["undoForOperationId"] = op.UndoForOpId
		}

		_, err := g.Model("SharedFileOperations").Insert(data)
		if err != nil {
			return err
		}

		// 更新文件版本号
		_, err = g.Model("SharedFileContents").
			Where("fileId=?", op.FileId).
			Data("version=version+1, lastUpdatedAt=NOW()").
			Update()
		return err

	case OpTypeCursor:
		// 更新用户光标位置
		_, err := g.Model("UserCursorPositions").
			Data(g.Map{
				"position":      op.Position,
				"lastUpdatedAt": time.Now(),
			}).
			Where("fileId=? AND userId=?", op.FileId, op.UserId).
			Save() // Save = Insert or Update
		return err

	default:
		return nil
	}
}

// UpdateFileContent 更新文件内容
func UpdateFileContent(ctx context.Context, fileId int64, userId int64, changeRecord string) error {
	// 解析更改记录
	var op OperationMessage
	if err := json.Unmarshal([]byte(changeRecord), &op); err != nil {
		return err
	}

	// 验证操作信息完整性
	if op.FileId != fileId || op.UserId != userId {
		return gerror.New("Invalid operation data")
	}

	// 处理操作并更新数据库
	if err := ProcessFileOperation(ctx, op); err != nil {
		return err
	}

	// 广播操作给其他用户
	wsManager := GetWebSocketManager()
	msgBytes, _ := json.Marshal(op)
	wsManager.BroadcastToFile(fileId, msgBytes, userId)

	return nil
}

// GetFileContent 获取文件内容和操作历史
func GetFileContent(ctx context.Context, fileId int64, userId int64) (g.Map, error) {
	// 检查用户权限
	count, err := g.Model("SharedFilePartners").
		Where("sharedFileId=? AND userId=?", fileId, userId).
		Count()
	if err != nil || count == 0 {
		return nil, gerror.New("User has no permission to access this file")
	}

	// 获取文件内容
	content := g.Map{}
	err = g.Model("SharedFileContents").
		Where("fileId=?", fileId).
		Scan(&content)
	if err != nil {
		return nil, err
	}

	// 获取最近的操作历史（可选：限制数量）
	var operations []g.Map
	err = g.Model("SharedFileOperations").
		Where("fileId=?", fileId).
		Order("timestamp DESC").
		Limit(100).
		Scan(&operations)
	if err != nil {
		return nil, err
	}

	// 获取当前在线用户
	var onlineUsers []g.Map
	err = g.Model("SharedFilePartners").
		Where("sharedFileId=? AND isOnline=?", fileId, true).
		Fields("userId", "isManager").
		Scan(&onlineUsers)
	if err != nil {
		return nil, err
	}

	// 获取用户光标位置
	var cursorPositions []g.Map
	err = g.Model("UserCursorPositions").
		Where("fileId=?", fileId).
		Scan(&cursorPositions)

	return g.Map{
		"content":         content,
		"operations":      operations,
		"onlineUsers":     onlineUsers,
		"cursorPositions": cursorPositions,
	}, nil
}
