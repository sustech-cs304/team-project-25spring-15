// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// ChatMessageInfo is the golang structure for table ChatMessageInfo.
type ChatMessageInfo struct {
	MessageId int64  `json:"messageId" orm:"messageId" description:""` //
	ChatId    int64  `json:"chatId"    orm:"chatId"    description:""` //
	OwnerId   int64  `json:"ownerId"   orm:"ownerId"   description:""` //
	Message   string `json:"message"   orm:"message"   description:""` //
}
