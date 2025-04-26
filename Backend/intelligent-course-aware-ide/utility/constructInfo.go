package utility

import (
	"reflect"

	"github.com/gogf/gf/frame/g"
)

func ConstructInfo(info interface{}) g.Map {
	updateUserInfo := g.Map{}
	val := reflect.ValueOf(info)
	typ := val.Type()
	for i := 1; i < val.NumField(); i++ {
		field := val.Field(i)
		typeField := typ.Field(i)
		fieldName := typeField.Name
		fieldValue := field.Interface()
		if !ValidInfo(fieldValue) {
			updateUserInfo[fieldName] = fieldValue
		}
	}
	return updateUserInfo
}
