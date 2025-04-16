# Software Engineering Sprint1

小组成员：朱育辰   孙杨洋   林易成   梁煜   朱柯奇



## 1. Architectural Design

![image-20250416013244863](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20250416013244863.png)



## 2. UI Design

### 主界面（课件模式）

<img src="C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20250415235631546.png" alt="image-20250415235631546"  />

这是 **Intelligent Course-Aware IDE** 的主界面，它主要分为以下几个区域：

1. **左侧侧边栏**：展示当前用户的所有课程，点击对应课程后会显示该课程下的所有Lecture。点击相应Lecture后，可在中间”课件“或”练习“等模块查看详细内容。
2. **顶部多标签栏**：在中间部分顶部有个多标签栏，用于切换不同的教学资料，比如课件、练习、对于该Lecture的讨论以及AI问答。
3. **中间内容区**：在“课件”模式下，上方显示 PDF 或讲义等课件，下方可嵌入示例代码。
4. **右侧笔记区域**：学生可以在这里编写Markdown记录学习笔记，或者插入简易代码块并运行得到结果。



### 课程练习列表

![image-20250416002818982](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20250416002818982.png)

这是练习列表页面，用户可以在这里查看当前Lecture下所有的代码练习，每个练习任务以标题、截止日期和状态呈现，让学生清晰地看到哪些任务已逾期、哪些任务即将截止等。用户可以点击任意练习查看其详细信息。



### 课程练习页面

![image-20250416003325384](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20250416003325384.png)

用户在任务列表点击任意任务后，用户会进入练习页面。该页面的中间部分会显示该编程练习的详细信息，比如描述、要求、测试用例以及提示等。右侧是一个集成式的代码编辑区域，学生可以在这里选择编程语言、编写和提交代码，提交完后会根据通过的测试样例获得对应分数。



### 讨论界面

![image-20250416010016566](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20250416010016566.png)

这是一个为学生和老师提供互动讨论的页面，学生可以在这里查看和发布评论，与老师或同学就课程内容、作业难点、代码问题等展开交流。每条评论都会显示用户头像及用户名。整个评论列表按时间排序，让最新话题始终居于顶部；下方的输入框则提供快速发言功能，使学生能够在一处集中讨论和协作，而无需离开 IDE 环境，从而大大提升学习与沟通的效率。



### AI界面

![image-20250416013054801](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20250416013054801.png)

这是一个集成 AI 功能的交互界面，学生可以向 AI 询问课程相关问题、生成思维导图或创建小测验，并让 AI 自动评分。界面上方显示对话记录。



## 3. 项目进展

### Frontend

- 确定了网站的基本框架，并进行了较为完整的UI设计
- 实现课程管理、笔记、练习等页面

### Backend

- 学习并熟悉 **golang** 的基本语法
- 实现一些基础的接口

### 开发过程中遇到的问题

- 由于环境问题，代码在不同主机上表现不一致
- go-lang的学习仍需一定时间
- 前后端API搭建的进度并不平衡