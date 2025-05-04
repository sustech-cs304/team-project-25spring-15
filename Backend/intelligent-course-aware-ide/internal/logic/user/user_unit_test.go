package user

import (
	"context"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/stretchr/testify/assert"
)

func TestNew(t *testing.T) {
	answer := &Users{}
	result := New()
	assert.Equal(t, answer, result)
}

func TestCheckUserHasPermssionOfUser(t *testing.T) {
	testcases := [8][2]int64{
		{1, 1},
		{2, 1},
		{4, 1},
		{999, 1},
		{1, 3},
		{2, 3},
		{3, 3},
		{3, 999},
	}
	answers := [8]bool{
		true, true, false, false, false, false, true, false,
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

func TestCheckUserIsStudent(t *testing.T) {
	testcases := [4]int64{
		1, 2, 3, 999,
	}
	answers := [4]bool{
		false, false, true, false,
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
