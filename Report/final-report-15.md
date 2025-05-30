# Team Report

## 成员
朱柯奇、朱育辰、梁煜、林易成、孙杨洋

---

## Metrics（项目指标）

我们对项目的代码结构与复杂度进行了详细统计与评估，主要包括以下几个方面：

- **代码总行数**：反映了项目的整体规模与开发工作量。
- **源文件数量**：展示了项目的模块化与工程结构。
- **圈复杂度（Cyclomatic Complexity）**：衡量了代码的逻辑复杂度，有助于评估代码的可维护性与潜在的错误风险。
- **依赖数量**：评估了项目中各个模块之间的依赖关系，越少的依赖有助于提高模块的独立性与可重用性。

详细统计信息已记录在以下日志文件中，可供进一步分析参考：  
🔗 [evaluate.log](https://github.com/sustech-cs304/team-project-25spring-15/blob/main/docs/evaluate.log)

---

## Documentation（项目文档）

### 用户文档

我们为普通用户准备了一份详细的使用文档，内容包括：

- 项目的开发背景与目标
- 系统的基本功能与使用流程
- 系统界面与操作指南

通过该文档，用户可以快速了解并上手使用我们的系统。

📄 [用户文档链接](https://github.com/sustech-cs304/team-project-25spring-15/blob/main/Instruction.md)

### 开发者文档

为方便后续开发与社区贡献，我们编写了 API 文档，内容包括：

- 每个接口的 URL、请求方法、请求参数与响应格式

开发者可通过该文档快速了解后端 API 的设计，进行前后端联调或继续开发。

📄 [开发者文档 (GitHub)](https://github.com/sustech-cs304/team-project-25spring-15/blob/main/%E6%99%BA%E8%83%BD%E8%AF%BE%E7%A8%8B%E6%84%9F%E7%9F%A5IDE%20-%20%E5%BC%80%E5%8F%91%E8%80%85%E6%96%87%E6%A1%A3.md)  
📄 [开发者文档 (Swagger)](http://47.117.144.50:8000/swagger)

---

## Test（测试体系）

我们采用 GoFrame 框架内置的 `gtest` 模块实现自动化测试。`gtest` 是一个轻量级但功能强大的 Go 测试工具，适用于单元测试与集成测试场景。

### 测试代码结构与实现

- 所有测试代码按照模块划分，分别放置于 `controller` 层每个 API 所在目录中。
- 测试用例以 `gtest.C` 结构体进行组织，结合 `gtest.Assert`、`gtest.AssertEQ`、`gtest.AssertNE` 等断言函数完成逻辑验证。

📁 [测试源码地址](https://github.com/sustech-cs304/team-project-25spring-15/tree/main/Backend/intelligent-course-aware-ide/internal/controller)

![image-20250529213420193](/Users/mac/Library/Application Support/typora-user-images/image-20250529213420193.png)

### 覆盖率与重点

- 超过 70% 的代码覆盖率，统计使用 `go test -cover` 工具完成。
- 测试重点包括：
  - 用户注册、登录及权限控制等核心认证流程
  - 课程管理、讲座发布与报名、练习创建与提交等主要业务模块
  - 系统在异常与边界条件下的稳定性保障

通过系统化测试，我们有效保障了项目在多种场景下的正确性和健壮性。

---

## Build（构建流程）

我们使用了 GNU Make 工具编写构建脚本（Makefile），自动完成代码编译、依赖安装、复杂度分析等任务，提升了开发与部署效率。

### 使用工具

- **GNU Make**
- **Go Modules**（依赖管理）
- **Python venv**（分析环境）

### 执行任务

- 启动后端开发容器环境
- 创建并配置 Python 虚拟环境
- 安装依赖工具（如 `cloc`、`gocyclo`、`lizard` 等）
- 后端与前端的代码行数统计、圈复杂度分析、依赖数量计算

### 构建产物

- 后端编译生成的可执行文件 `main`
- 自动分析生成的结果输出（如代码复杂度、文件数量等）
- 构建脚本 `Makefile`

自动化构建流程确保了项目具备良好的可维护性与可部署性。

---

## Deployment（部署流程）

为实现系统的高效部署与服务能力，我们采用了容器化部署方式。项目被拆分为以下服务：

- 后端服务（`app`）
- 代码运行服务（`runner`）
- 数据库服务（`database`）

通过 Docker 技术对系统进行了封装和管理，并结合 Docker Compose 与 Docker Swarm 实现部署编排。

### 使用技术/工具

- **Docker**
- **Docker Compose**
- **Docker Swarm**
- **Golang 1.23**
- **MySQL 8.0**
- **Python 3**（runner 服务）

### 容器化文件位置

- 各服务的 Dockerfile 位于：  
  📁 [Dockerfiles/](https://github.com/sustech-cs304/team-project-25spring-15/tree/main/Backend/Dockerfiles)

- 开发环境下服务运行配置文件：  
  📄 [docker-compose.dev.yml](https://github.com/sustech-cs304/team-project-25spring-15/blob/main/Backend/docker-compose.dev.yml)

### 容器化成功证明

- 所有容器可通过 `docker-compose up` 和 `docker stack deploy` 命令构建并运行。
- 数据和日志通过挂载卷成功实现持久化。

---

> 项目源码与更多细节可参考 GitHub 仓库：  
> 🔗 [https://github.com/sustech-cs304/team-project-25spring-15](https://github.com/sustech-cs304/team-project-25spring-15)