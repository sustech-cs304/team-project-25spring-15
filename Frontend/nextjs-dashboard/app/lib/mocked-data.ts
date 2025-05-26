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

export const mocked_markdown_example = `
---

# 📚 Reading 1: Static Checking
## 软件构造课程笔记

---

### 🔍 本节课目标（Objectives）

今天我们将学习两个核心主题：

1. **静态检查（Static Typing）**
2. **良好软件的三大特性（The Big Three Properties of Good Software）**

---

## 🧮 示例：Hailstone 序列（冰雹序列）

我们将以 **Hailstone 序列** 作为贯穿全课的示例来讲解相关概念。

### 定义（Definition）

Hailstone 序列定义如下：

- 从一个整数 \`n\` 开始；
- 如果 \`n\` 是偶数，则下一个数是 \`n / 2\`；
- 如果 \`n\` 是奇数，则下一个数是 \`3n + 1\`；
- 当序列到达 \`1\` 时结束。

### 示例（Examples）

| 起始值 | Hailstone 序列 |
|--------|----------------|
| 2      | 2, 1           |
| 3      | 3, 10, 5, 16, 8, 4, 2, 1 |
| 4      | 4, 2, 1        |
| 5      | 5, 16, 8, 4, 2, 1 |
| 7      | 7, 22, 11, 34, 17, 52, 26, 13, 40, ... ?（请自行追踪直到终止） |

> ⚠️ **注意**：虽然所有起始值最终都会降到 1 的猜想尚未被数学证明，但被称为 **Collatz 猜想（Collatz Conjecture）**，是一个未解难题。

### 为什么叫“冰雹”序列？

因为这个序列在数值上会上下波动，就像冰雹在云中上下翻滚，直到最后落到地面一样。

---

## 💻 编程实现：计算 Hailstone 序列

我们用 **Python** 和 **JavaScript** 分别实现该序列，并进行对比说明。

### Python 实现

\`\`\`python
n = 3
while n != 1:
    print(n)
    if n % 2 == 0:
        n = n // 2
    else:
        n = 3 * n + 1
print(n)
\`\`\`

### C 实现

\`\`\`c
#include <stdio.h>

int main() {
    int n = 3;
    while (n != 1) {
        printf("%d\\n", n);
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
    }
    printf("%d\\n", n);
    return 0;
}
\`\`\`

### JavaScript/TypeScript 实现

\`\`\`javascript
let n = 3;
while (n !== 1) {
    console.log(n);
    if (n % 2 === 0) {
        n = n / 2;
    } else {
        n = 3 * n + 1;
    }
}
console.log(n);
\`\`\`

---

## 🆚 Python 与 JavaScript 的语法对比

| 特性 | Python | JavaScript |
|------|--------|------------|
| 条件语句括号 | 不需要 | 必须有括号 ( ) |
| 语句结尾 | 自动换行 | 使用分号 \`;\`（推荐始终写上） |
| 代码块界定 | 缩进 | 使用 {} 括起来，缩进仅用于阅读 |
| 相等判断 | \`==\` / \`!=\` | 推荐使用 \`===\` / \`!==\`（避免类型转换） |

### 关键点说明

- **自动插入分号（ASI）**：JavaScript 允许省略分号，但可能导致难以发现的错误。
- **缩进 vs 大括号**：JavaScript 不依赖缩进，但良好的缩进仍然是程序员沟通的重要方式。
- **严格相等操作符（\`===\`）**：避免了 JavaScript 中 \`==\` 的类型自动转换陷阱。例如：
  - \`0 == ""\` → \`true\`
  - \`0 === ""\` → \`false\`

---

## ✅ 小结（Summary）

- Hailstone 序列是一个有趣的数学现象，常用于教学和测试程序逻辑。
- Python 和 JavaScript 在语法上有许多相似之处，但也有一些关键差异：
  - 缩进 vs 大括号
  - 类型比较（\`==\` vs \`===\`）
  - 分号使用规范
- 静态检查和良好编码习惯可以帮助我们写出更安全、更可靠的代码。

---

如需将此 Markdown 文件导出为 PDF 或 HTML，请告诉我，我可以为你生成对应格式的文件。
`

export default mocked_exercise;
