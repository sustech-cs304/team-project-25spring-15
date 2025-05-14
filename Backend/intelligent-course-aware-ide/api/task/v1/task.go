package v1

import (
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
)

type GetAllTaskInfoWithUserIdReq struct {
	g.Meta `path:"/api/task/getTasks" method:"get" tags:"Course" summary:"get info of all courses"`
}

type GetAllTaskInfoWithUserIdRes struct {
	g.Meta   `mime:"text/html" example:"json"`
	AllTasks []*entity.Tasks `json:"tasks" dc:"Info of all tasks of this user"`
}
