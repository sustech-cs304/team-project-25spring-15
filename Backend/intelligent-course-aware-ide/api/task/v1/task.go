package v1

import (
	"intelligent-course-aware-ide/internal/model/entity"

	"github.com/gogf/gf/v2/frame/g"
)

type GetAllTaskInfoWithUserIdReq struct {
	g.Meta `path:"/api/task/getTasks" method:"get" tags:"Task" summary:"get info of all courses"`
}

type GetAllTaskInfoWithUserIdRes struct {
	g.Meta   `mime:"text/html" example:"json"`
	AllTasks []*entity.Tasks `json:"tasks" dc:"Info of all tasks of this user"`
}

type HandleTaskReq struct {
	g.Meta   `path:"/api/task/getTasks" method:"get" tags:"Task" summary:"get info of all courses"`
	TaskId   int64  `json:"taskId" dc:"Id of this task"`
	Decision int    `json:"decision" dc:"Decision of this task"`
	Comment  string `json:"comment" dc:"Comment of this task"`
}

type HandleTaskRes struct {
	g.Meta  `mime:"text/html" example:"json"`
	Success bool `json:"success" dc:"success or not"`
}
