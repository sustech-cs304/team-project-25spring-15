// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// Tasks is the golang structure for table Tasks.
type Tasks struct {
	TaskId      int64  `json:"taskId"      orm:"taskId"      description:""` //
	ReviewerId  int64  `json:"reviewerId"  orm:"reviewerId"  description:""` //
	PublisherId int64  `json:"publisherId" orm:"publisherId" description:""` //
	Decision    int    `json:"decision"    orm:"decision"    description:""` //
	Kind        string `json:"kind"        orm:"kind"        description:""` //
	TaskInfo    string `json:"taskInfo"    orm:"taskInfo"    description:""` //
}
