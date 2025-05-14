// =================================================================================
// Code generated and maintained by GoFrame CLI tool. DO NOT EDIT.
// =================================================================================

package entity

// FuzzySearchAdv is the golang structure for table fuzzy_search_adv.
type FuzzySearchAdv struct {
	FuzzySearchId int    `json:"fuzzySearchId" orm:"fuzzy_search_id" description:""` //
	Id            int64  `json:"id"            orm:"id"              description:""` //
	MatchCount    int64  `json:"matchCount"    orm:"match_count"     description:""` //
	Info          string `json:"info"          orm:"info"            description:""` //
	Name          string `json:"name"          orm:"name"            description:""` //
	SourceTable   string `json:"sourceTable"   orm:"source_table"    description:""` //
}
