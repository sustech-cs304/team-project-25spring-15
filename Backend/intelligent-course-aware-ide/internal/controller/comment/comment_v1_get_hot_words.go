package comment

import (
	"context"
	"sort"

	"github.com/gogf/gf/v2/container/gmap"
	"github.com/yanyiwu/gojieba"

	v1 "intelligent-course-aware-ide/api/comment/v1"
)

var stopWords = map[string]bool{
	"我": true, "你": true, "是": true, "啊": true, "的": true, "了": true, "吗": true, "在": true, "和": true,
}

type cComment struct{}

var Comment = cComment{}
var jieba *gojieba.Jieba

func init() {
	jieba = gojieba.NewJieba()
}
func cleanup() {
	jieba.Free()
}
func (c *ControllerV1) GetHotWords(ctx context.Context, req *v1.GetHotWordsReq) (res *v1.GetHotWordsRes, err error) {
	commentRes, err := c.GetComment(ctx, &v1.GetCommentReq{LectureId: req.LectureId})
	if err != nil {
		return nil, err
	}
	wordMap := gmap.NewStrIntMap()
	for _, comment := range commentRes.Comments {
		words := jieba.CutForSearch(comment.Content, true)
		for _, word := range words {
			if len([]rune(word)) <= 1 || stopWords[word] {
				continue
			}
			val := wordMap.Get(word)
			wordMap.Set(word, val+1)
		}
	}

	list := make([]*v1.HotWord, 0)
	wordMap.Iterator(func(k string, v int) bool {
		list = append(list, &v1.HotWord{Word: k, Count: v})
		return true
	})

	// 排序 + 限制前20个
	sort.Slice(list, func(i, j int) bool {
		return list[i].Count > list[j].Count
	})
	if len(list) > 20 {
		list = list[:20]
	}

	res = &v1.GetHotWordsRes{
		List: list,
	}
	return
}
