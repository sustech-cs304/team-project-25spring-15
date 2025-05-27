# Intelligent Course-Aware IDE

An intelligent IDE designed specifically for course management and learning, integrating advanced features for both educators and students.

## Features

- 🎓 Course Management
  - Course creation and organization
  - Lecture materials management
  - Assignment distribution and collection
  - Real-time collaboration tools

- 👨‍🏫 Teaching Tools
  - Interactive code examples
  - Real-time code execution
  - Automated grading system
  - Progress tracking

- 👨‍💻 Student Features
  - Integrated development environment
  - Assignment submission system
  - Code collaboration tools
  - Progress tracking

- 🛠 Technical Features
  - Modern web-based IDE
  - Real-time collaboration
  - Code execution engine
  - Automated testing
  - File management system

## Project Structure

```
.
├── Backend/                    # Backend services
│   └── intelligent-course-aware-ide/
│       ├── api/               # API definitions
│       ├── internal/          # Internal implementation
│       ├── manifest/          # Configuration files
│       └── test/             # Test files
├── Frontend/                  # Frontend applications
│   ├── nextjs-dashboard/     # Admin dashboard
│   └── intelligent-course-aware-ide/  # Main IDE interface
├── docs/                     # Documentation
└── Report/                   # Project reports and documentation
```

## Quick Start

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for development setup instructions.
See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for deployment instructions.

## Technology Stack

### Backend
- Go 1.22+
- GoFrame v2.9.0
- MySQL 8.0+

### Frontend
- Next.js
- React
- Material-UI
- TailwindCSS

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 1. Set up

#### Backend:

We use Docker to islate the code sent by frontend and we will also try to use docker to deploy the IDE.

Up to 2025-04-16, if you want to run backend, you should follow the following steps:

1. Download Docker Desktop and pull image from y261/sustech_CS304_25_group 15:1.0.0  
Or you also could download it from ``https://www.123865.com/s/HcLQTd-a9nl``Or you could contact with us: email: ``12211219@mail.sustech.edu.cn``, qq: ``3288925742``
2. Open Docker server and execute ``docker run -d -it --name CS304 -v {path}:/usr/Document -p 3306:3306 y261/sustech_cs304_25_group15:1.0.0`` in cmd.  
  **Attention: Here you should replace the {place} to the path you want to store the scrips**
3. Run ``python server_setup.py``in Backend\intelligent-course-aware-ide or run the following command in cmd:  
   step1: ``docker start CS304``  
   step2:``docker exec CS304 server mysql start``  
   step3:``go run main.go``in Backend\intelligent-course-aware-ide  

Here is the version of critical packages we install in the image(based on ubuntu0.22.04.1 for Linux on x86_64):

1. mysql: Ver 8.0.41-0  
2. gcc: gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0  
3. python: Python 3.10.12  

## 2. Test

#### Unit Test(internal/logic)

+ user: 100%
+ course: 100%
+ chat: 100%
+ chatMessage: 100%
+ assignment: 54.5%
+ runner: 23.7%

#### Integration Test

+ user:
