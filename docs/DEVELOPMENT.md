# Development Guide

This document provides instructions for setting up the development environment and contributing to the project.

## Prerequisites

### Backend Development
- Go 1.22 or higher
- MySQL 8.0 or higher
- Make (for build automation)
- Git

### Frontend Development
- Node.js 18 or higher
- pnpm (recommended) or npm
- Git

## Setting Up the Development Environment

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/intelligent-course-aware-ide.git
cd intelligent-course-aware-ide
```

### 2. Backend Setup

```bash
cd Backend/intelligent-course-aware-ide

# Install Go dependencies
go mod download

# Set up the database
# Create a new MySQL database
mysql -u root -p
CREATE DATABASE mysqlTest;

# Initialize the database schema
go run main.go -mod=init

# Start the development server
go run main.go
```

### 3. Frontend Setup

```bash
cd Frontend/nextjs-dashboard

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## Project Structure Details

### Backend Structure
```
Backend/intelligent-course-aware-ide/
├── api/                    # API definitions and documentation
├── internal/              # Internal implementation
│   ├── cmd/              # Command line interface
│   ├── controller/       # Request handlers
│   ├── dao/             # Data Access Objects
│   ├── logic/           # Business logic
│   ├── model/           # Data models
│   └── service/         # Service layer
├── manifest/             # Configuration files
│   └── config/          # Application configuration
├── test/                # Test files
└── main.go              # Application entry point
```

### Frontend Structure
```
Frontend/nextjs-dashboard/
├── app/                 # Next.js app directory
├── components/         # Reusable React components
├── lib/               # Utility functions and helpers
├── public/            # Static assets
└── styles/            # CSS and styling files
```

## Development Workflow

1. **Create a New Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow the coding standards
   - Write tests for new features
   - Update documentation as needed

3. **Run Tests**
   ```bash
   # Backend tests
   cd Backend/intelligent-course-aware-ide
   go test ./...

   # Frontend tests
   cd Frontend/nextjs-dashboard
   pnpm test
   ```

4. **Submit Changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

## Code Style Guidelines

### Go Code Style
- Follow the [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- Use `gofmt` to format your code
- Run `golint` and `go vet` before committing

### TypeScript/JavaScript Code Style
- Follow the project's ESLint configuration
- Use Prettier for code formatting
- Follow the [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Configuration

### Backend Configuration
Configuration files are located in `Backend/intelligent-course-aware-ide/manifest/config/`

Example configuration (config.yaml):
```yaml
server:
  address: ":8000"
  openapiPath: "/api.json"
  swaggerPath: "/swagger"

logger:
  level: "all"
  stdout: true

database:
  default:
    link: "mysql:user:password@tcp(127.0.0.1:3306)/mysqlTest"
```

### Frontend Configuration
Environment variables can be set in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Debugging

### Backend Debugging
1. Use VS Code's Go debugger
2. Set up launch configuration in `.vscode/launch.json`
3. Use `log.Debug()` for debug logging

### Frontend Debugging
1. Use Chrome DevTools
2. React Developer Tools extension
3. Use `console.log()` or `debugger` statement

## Common Issues and Solutions

1. **Database Connection Issues**
   - Check MySQL service is running
   - Verify database credentials
   - Ensure database exists

2. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version
   - Verify package.json dependencies

3. **API Connection Issues**
   - Check CORS configuration
   - Verify API endpoint URLs
   - Check network connectivity 