package user

import (
	"context"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/stretchr/testify/assert"
)

func TestCheckUserHasPermssionOfUser(t *testing.T) {
	testcases := [8][2]int64{
		{1, 1},
		{2, 1},
		{3, 1},
		{999, 1},
		{1, 3},
		{3, 3},
		{4, 3},
		{4, 999},
	}
	answers := [8]bool{
		true, false, true, false, false, true, false, false,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	testUser := New()
	for index, testcase := range testcases {
		result, err := testUser.CheckUserHasPermssionOfUser(ctx, testcase[0], testcase[1])
		t.Log(index, testcase, result, err)
		assert.Equal(t, answers[index], result)
	}

}
