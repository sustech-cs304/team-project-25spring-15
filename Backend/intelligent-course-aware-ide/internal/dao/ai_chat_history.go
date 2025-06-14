// =================================================================================
// This file is auto-generated by the GoFrame CLI tool. You may modify it as needed.
// =================================================================================

package dao

import (
	"intelligent-course-aware-ide/internal/dao/internal"
)

// internalAIChatHistoryDao is an internal type for wrapping the internal DAO implementation.
type internalAIChatHistoryDao = *internal.AIChatHistoryDao

// aIChatHistoryDao is the data access object for the table AIChatHistory.
// You can define custom methods on it to extend its functionality as needed.
type aIChatHistoryDao struct {
	internalAIChatHistoryDao
}

var (
	// AIChatHistory is a globally accessible object for table AIChatHistory operations.
	AIChatHistory = aIChatHistoryDao{
		internal.NewAIChatHistoryDao(),
	}
)

// Add your custom methods and functionality below.
