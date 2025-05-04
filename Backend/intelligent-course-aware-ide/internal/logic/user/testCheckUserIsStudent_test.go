package user

import (
	"context"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/stretchr/testify/assert"
)

func TestCheckUserIsStudent(t *testing.T) {
	testcases := [4]int64{
		1, 3, 4, 999,
	}
	answers := [4]bool{
		false, true, false, false,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	testUser := New()
	for index, testcase := range testcases {
		result := testUser.CheckUserIsStudent(ctx, testcase)
		t.Log(index, testcase, result)
		assert.Equal(t, answers[index], result)
	}
}
