package v1

import "github.com/gogf/gf/v2/frame/g"

type ExampleReq struct {
	g.Meta `path:"/example" method:"post" tags:"example" summary:"test Backend"`
}

type ExampleRes struct {
	Result string `json:"result"`
}
