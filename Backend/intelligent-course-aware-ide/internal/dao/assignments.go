// =================================================================================
// This file is auto-generated by the GoFrame CLI tool. You may modify it as needed.
// =================================================================================

package dao

import (
	"intelligent-course-aware-ide/internal/dao/internal"
)

// assignmentsDao is the data access object for the table Assignments.
// You can define custom methods on it to extend its functionality as needed.
type assignmentsDao struct {
	*internal.AssignmentsDao
}

var (
	// Assignments is a globally accessible object for table Assignments operations.
	Assignments = assignmentsDao{internal.NewAssignmentsDao()}
)

// Add your custom methods and functionality below.
