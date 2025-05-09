// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// User is the golang structure for table user.
type User struct {
	Id     uint   `json:"lectureId"     orm:"lectureId"     description:"user lectureId"`     // user lectureId
	Name   string `json:"name"   orm:"name"   description:"user name"`   // user name
	Status int    `json:"status" orm:"status" description:"user status"` // user status
	Age    uint   `json:"age"    orm:"age"    description:"user age"`    // user age
}
