// =================================================================================
// This file is auto-generated by the GoFrame CLI tool. You may modify it as needed.
// =================================================================================

package dao

import (
	"intelligent-course-aware-ide/internal/dao/internal"
)

// coursesDao is the data access object for the table Courses.
// You can define custom methods on it to extend its functionality as needed.
type coursesDao struct {
	*internal.CoursesDao
}

var (
	// Courses is a globally accessible object for table Courses operations.
	Courses = coursesDao{internal.NewCoursesDao()}
)

// Add your custom methods and functionality below.
