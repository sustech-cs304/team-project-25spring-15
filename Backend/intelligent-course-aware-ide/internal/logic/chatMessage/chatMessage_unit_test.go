package chatmessage

import (
	"context"
	"testing"
	"time"

	_ "github.com/gogf/gf/contrib/drivers/mysql/v2"
	"github.com/stretchr/testify/assert"

	chatv1 "intelligent-course-aware-ide/api/chat/v1"
)

func TestNew(t *testing.T) {
	answer := &ChatMessages{}
	result := New()
	assert.Equal(t, answer, result)
}

func TestCheckUserIsTheOwnerOfChatMessage(t *testing.T) {
	chatMessage1 := chatv1.MessageInfo{
		MessageId: 0,
		ChatId:    1,
		OwnerId:   1,
	}
	chatMessage2 := chatv1.MessageInfo{
		MessageId: 1,
		ChatId:    0,
		OwnerId:   1,
	}
	chatMessage3 := chatv1.MessageInfo{
		MessageId: 1,
		ChatId:    1,
		OwnerId:   0,
	}
	chatMessage4 := chatv1.MessageInfo{
		MessageId: 1,
		ChatId:    1,
		OwnerId:   1,
	}
	chatMessage5 := chatv1.MessageInfo{
		MessageId: 2,
		ChatId:    1,
		OwnerId:   2,
	}
	chatMessage6 := chatv1.MessageInfo{
		MessageId: 2,
		ChatId:    1,
		OwnerId:   1,
	}

	testcases1 := [6]int64{
		1, 1, 1, 1, 1, 1,
	}

	testcases2 := [6]chatv1.MessageInfo{
		chatMessage1, chatMessage2, chatMessage3, chatMessage4, chatMessage5, chatMessage6,
	}

	answers := [6]bool{
		false, false, false, true, false, false,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()
	testChatMessage := New()
	for index, testcase := range testcases1 {
		result, err := testChatMessage.CheckUserIsTheOwnerOfChatMessage(ctx, testcase, &testcases2[index])
		t.Log(index, testcase, result, err)
		assert.Equal(t, answers[index], result)
	}
}
