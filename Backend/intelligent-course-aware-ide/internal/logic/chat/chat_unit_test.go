package chat

import (
	"context"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/stretchr/testify/assert"
)

func TestNew(t *testing.T) {
	answer := &Chats{}
	result := New()
	assert.Equal(t, answer, result)
}

func TestCheckUserHasFullPermissionOfChat(t *testing.T) {
	testcases := [6][2]int64{
		{1, 1},
		{1, 2},
		{2, 1},
		{2, 2},
		{999, 1},
		{1, 999},
	}
	answers := [6]bool{
		true, true, false, true, false, false,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	testChat := New()
	for index, testcase := range testcases {
		result, err := testChat.CheckUserHasFullPermissionOfChat(ctx, testcase[0], testcase[1])
		t.Log(index, testcase, result, err)
		assert.Equal(t, answers[index], result)
	}
}

func TestCheckUserHasHalfPermissionOfChat(t *testing.T) {
	testcases := [5][2]int64{
		{1, 1},
		{1, 2},
		{2, 1},
		{2, 2},
		{1, 3},
	}
	answers := [5]bool{
		false, false, true, false, false,
	}
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	testChat := New()
	for index, testcase := range testcases {
		result, err := testChat.CheckUserHasHalfPermissionOfChat(ctx, testcase[0], testcase[1])
		t.Log(index, testcase, result, err)
		assert.Equal(t, answers[index], result)
	}
}
