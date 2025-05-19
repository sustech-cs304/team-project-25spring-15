// internal/service/websocket.go
package service

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"

	"github.com/gogf/gf/v2/database/gredis"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gctx"
	"github.com/gorilla/websocket"
)

// 定义操作类型常量
const (
	OpTypeInsert = "INSERT"
	OpTypeDelete = "DELETE"
	OpTypeUpdate = "UPDATE"
	OpTypeMove   = "MOVE"
	OpTypeCursor = "CURSOR"
)

// 操作消息结构
type OperationMessage struct {
	Type        string `json:"type"`
	FileId      int64  `json:"fileId"`
	UserId      int64  `json:"userId"`
	Position    int    `json:"position"`
	Content     string `json:"content,omitempty"`
	Timestamp   int64  `json:"timestamp"`
	UserName    string `json:"userName,omitempty"`
	IsUndoOp    bool   `json:"isUndoOp,omitempty"`
	UndoForOpId int64  `json:"undoForOpId,omitempty"`
}

// WebSocket连接管理器
type WebSocketManager struct {
	// 文件ID -> 用户ID -> WebSocket连接
	connections map[int64]map[int64]*ghttp.WebSocket
	mutex       sync.RWMutex
	redis       *gredis.Redis
}

var (
	wsManager     *WebSocketManager
	wsManagerOnce sync.Once
)

// 获取WebSocket管理器单例
func GetWebSocketManager() *WebSocketManager {
	wsManagerOnce.Do(func() {
		redis := g.Redis()
		if redis == nil {
			g.Log().Error(gctx.New(), "Failed to initialize Redis")
		}

		wsManager = &WebSocketManager{
			connections: make(map[int64]map[int64]*ghttp.WebSocket),
			redis:       redis,
		}
	})
	return wsManager
}

// 添加连接
func (m *WebSocketManager) AddConnection(fileId, userId int64, ws *ghttp.WebSocket) {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	if _, ok := m.connections[fileId]; !ok {
		m.connections[fileId] = make(map[int64]*ghttp.WebSocket)
	}
	m.connections[fileId][userId] = ws

	// 更新用户在线状态
	ctx := gctx.New()
	_, err := g.Model("SharedFilePartners").
		Where("sharedFileId=? AND userId=?", fileId, userId).
		Data(g.Map{"isOnline": true}).
		Update()
	if err != nil {
		g.Log().Error(ctx, "Failed to update online status:", err)
	}

	// 发送通知其他用户有新用户加入
	m.BroadcastUserStatus(fileId, userId, true)
}

// 移除连接
func (m *WebSocketManager) RemoveConnection(fileId, userId int64) {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	if fileConns, ok := m.connections[fileId]; ok {
		delete(fileConns, userId)
		if len(fileConns) == 0 {
			delete(m.connections, fileId)
		}
	}

	// 更新用户离线状态
	ctx := gctx.New()
	_, err := g.Model("SharedFilePartners").
		Where("sharedFileId=? AND userId=?", fileId, userId).
		Data(g.Map{"isOnline": false}).
		Update()
	if err != nil {
		g.Log().Error(ctx, "Failed to update offline status:", err)
	}

	// 广播用户离线消息
	m.BroadcastUserStatus(fileId, userId, false)
}

// 广播消息给文件所有在线用户
func (m *WebSocketManager) BroadcastToFile(fileId int64, message []byte, excludeUserId int64) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	if fileConns, ok := m.connections[fileId]; ok {
		for userId, conn := range fileConns {
			if userId != excludeUserId {
				if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
					g.Log().Error(gctx.New(), "Failed to broadcast message:", err)
				}
			}
		}
	}
}

// 广播用户状态变化
func (m *WebSocketManager) BroadcastUserStatus(fileId, userId int64, isOnline bool) {
	statusMsg := struct {
		Type     string `json:"type"`
		FileId   int64  `json:"fileId"`
		UserId   int64  `json:"userId"`
		IsOnline bool   `json:"isOnline"`
	}{
		Type:     "USER_STATUS",
		FileId:   fileId,
		UserId:   userId,
		IsOnline: isOnline,
	}

	msgBytes, err := json.Marshal(statusMsg)
	if err != nil {
		g.Log().Error(gctx.New(), "Failed to marshal user status message:", err)
		return
	}

	m.BroadcastToFile(fileId, msgBytes, userId)
}

// 发布操作到Redis以便持久化
func (m *WebSocketManager) PublishOperation(ctx context.Context, op OperationMessage) error {
	opBytes, err := json.Marshal(op)
	if err != nil {
		return err
	}

	channel := fmt.Sprintf("file:%d:operations", op.FileId)
	if m.redis != nil {
		_, err = m.redis.Publish(ctx, channel, string(opBytes))
		return err
	}
	return nil
}
