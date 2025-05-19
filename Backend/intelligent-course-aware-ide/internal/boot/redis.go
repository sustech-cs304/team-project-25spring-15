// internal/boot/redis.go
package boot

import (
	"encoding/json"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gctx"

	"intelligent-course-aware-ide/internal/logic/socket"
)

// 启动Redis监听器
func StartRedisSubscriber() {
	ctx := gctx.New()
	redis := g.Redis()
	if redis == nil {
		g.Log().Error(ctx, "Failed to get Redis adapter")
		return
	}

	// 订阅所有文件操作频道
	conn, _, err := redis.PSubscribe(ctx, "file:*:operations")
	if err != nil {
		g.Log().Error(ctx, "Failed to psubscribe:", err)
		return
	}
	defer conn.Close(ctx)

	// 接收消息并处理
	for {
		msg, err := conn.ReceiveMessage(ctx)
		if err != nil {
			g.Log().Error(ctx, "Redis subscription error:", err)
			continue
		}

		// 解析操作消息
		var op socket.OperationMessage
		if err := json.Unmarshal([]byte(msg.Payload), &op); err != nil {
			g.Log().Error(ctx, "Failed to parse operation message:", err)
			continue
		}

		// 异步持久化操作到数据库
		go func(operation socket.OperationMessage) {
			if err := socket.ProcessFileOperation(ctx, operation); err != nil {
				g.Log().Error(ctx, "Failed to persist operation:", err)
			}
		}(op)
	}
}
