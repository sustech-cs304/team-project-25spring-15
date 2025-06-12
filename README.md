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

## Set up

#### Backend:

We use Docker to islate the code sent by frontend and we will also try to use docker to deploy the IDE.

Up to 2025-05-29, if you want to run backend, you should follow the following steps:

dev environment: 
``` bash
make setup-backend-dev
```

If you want to stop backend, you could execute this command

``` bash
make close-backend-dev
```

ope environment:
``` bash
make setup-backend-ope
```

If you want to stop backend, you could execute this command

``` bash
make close-backend-ope
```



Here is the version of critical packages we install in the image(based on ubuntu0.22.04.1 for Linux on x86_64):

1. mysql: Ver 8.0.41-0  
2. gcc: gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0  
3. python: Python 3.10.12  
