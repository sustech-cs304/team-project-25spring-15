package utility

import (
	"reflect"
	"time"

	"github.com/gogf/gf/util/gconv"
)

func ValidInfo(fieldValue any) bool {
	switch val := fieldValue.(type) {
	case string:
		return val == ""
	case int, int64, int32:
		return gconv.Int64(val) == 0
	case float64, float32:
		return gconv.Float64(val) == 0
	case time.Time:
		return val.IsZero()
	default:
		return reflect.DeepEqual(fieldValue, reflect.Zero(reflect.TypeOf(fieldValue)).Interface())
	}
}
