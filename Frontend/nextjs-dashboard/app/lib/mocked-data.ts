const mocked_exercise = `## 练习描述

### 要求
- 正确实现快速排序算法的分区 (partition) 操作
- 递归处理子数组的排序
- 确保算法在各种输入情况下都能正确工作
- 考虑时间和空间复杂度

### 测试用例
| 输入 | 期望输出 |
| ----- | ----- |
| [3, 1, 4, 1, 5, 9, 2, 6] | [1, 1, 2, 3, 4, 5, 6, 9] |
| [1, 1, 1, 1] | [1, 1, 1, 1] |
| [2, 2, 2] | [2, 2, 2] |

### 提示
1. 将数组分为两部分
2. 对这两部分分别递归处理
3. 将每一个数组分成两部分`;

export const initialTasks = [
  {
      id: 1,
      title: '完成斐波那契数列联系',
      status: '已逾期',
      isUrgent: false,
      isDone: false,
  },
  {
      id: 2,
      title: '实现快速排序算法',
      status: '今日截止',
      isUrgent: true,
      isDone: false,
  },
  {
      id: 3,
      title: '实现二叉树遍历算法',
      status: '4月25日',
      isUrgent: false,
      isDone: false,
  },
  {
      id: 4,
      title: '解决递归问题',
      status: '已完成',
      isUrgent: false,
      isDone: true,
  },
  {
      id: 5,
      title: '编写冒泡排序',
      status: '今日截止',
      isUrgent: false,
      isDone: false,
  },
  {
      id: 6,
      title: '优化查找算法',
      status: '待完成',
      isUrgent: false,
      isDone: false,
  },
  {
      id: 7,
      title: '处理字符串操作',
      status: '已完成',
      isUrgent: false,
      isDone: true,
  },
];

interface ExerciseContents {
  [key: number]: string;  // 允许使用数字作为索引
}

export const exerciseContents: ExerciseContents = {
  1: "# 斐波那契数列\n\n实现一个函数，计算斐波那契数列的第n项。\n\n```javascript\nfunction fibonacci(n) {\n  // 请在此实现\n}\n```",
  2: "# 快速排序\n\n请实现快速排序算法，对给定数组进行排序。\n\n```javascript\nfunction quickSort(arr) {\n  // 请在此实现\n}\n```",
  3: "# 二叉树遍历\n\n请实现二叉树的前序、中序和后序遍历。\n\n```javascript\nfunction preOrder(root) {\n  // 请在此实现\n}\n\nfunction inOrder(root) {\n  // 请在此实现\n}\n\nfunction postOrder(root) {\n  // 请在此实现\n}\n```",
  4: "# 递归问题\n\n请使用递归实现阶乘函数。\n\n```javascript\nfunction factorial(n) {\n  // 请在此实现\n}\n```",
  5: "# 冒泡排序\n\n请实现冒泡排序算法。\n\n```javascript\nfunction bubbleSort(arr) {\n  // 请在此实现\n}\n```",
  6: "# 二分查找\n\n请实现二分查找算法。\n\n```javascript\nfunction binarySearch(arr, target) {\n  // 请在此实现\n}\n```",
  7: "# 字���串操作\n\n请实现一个函数，判断字符串是否为回文。\n\n```javascript\nfunction isPalindrome(str) {\n  // 请在此实现\n}\n```"
};

export default mocked_exercise;

