// =================================================================================
// This file is auto-generated by the GoFrame CLI tool. You may modify it as needed.
// =================================================================================

package dao

import (
	"intelligent-course-aware-ide/internal/dao/internal"
)

// assignmentUserInfoDao is the data access object for the table AssignmentUserInfo.
// You can define custom methods on it to extend its functionality as needed.
type assignmentUserInfoDao struct {
	*internal.AssignmentUserInfoDao
}

var (
	// AssignmentUserInfo is a globally accessible object for table AssignmentUserInfo operations.
	AssignmentUserInfo = assignmentUserInfoDao{internal.NewAssignmentUserInfoDao()}
)

// Add your custom methods and functionality below.
