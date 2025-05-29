package consts

import "time"

// Operation url
// const TargetUrl string = "http://runner:8001"
const TargetUrl string = "http://localhost:8001"
const TmpDirPath string = "/usr/Document/tmp/"

// Database dockerName
const TargetDockerName string = "$(docker ps -q --filter ancestor=backend-runner | head -n 1)"

// Python dockerName
const TargetPythonDockerName string = TargetDockerName

// C/C++ dockerName
const TargetCDockerName string = TargetDockerName

// Default name of script
const TmpFileName string = "temp_script"

// Default path of script on host
// const PathForHost string = "/usr/Document/"
const PathForHost string = "/home/admin/team-project-25spring-15/Backend/data/"

// Default path of script on docker
const PathForDocker string = "/usr/Document/"

// Default direction of lecture file, including courseware/note
const PathForLecture string = "./upload/lecture/"

// Path of testcase
const TestTestcase string = "/usr/test/testcase.txt"

// Path of answer
const TestAnswer string = "/usr/test/answer.txt"

// Path of result
const TestResult string = "/usr/test/result.txt"

// Path of correct C/Cpp file
const TestRunnableCFilePath string = "/usr/test/attempt1.cpp"

// Path of wrong C/Cpp file
const TestWrongCFilePath string = "/usr/test/attempt3.cpp"

// Path of executable file
const TestCFileExecutablePath string = "/usr/test/attempt"

// Path of correct python file
const TestRunnablePythonFilePath string = "/usr/test/attempt2.py"

// Path of wrong python file
const TestRPythonFilePath string = "/usr/test/attempt4.py"

// JWT key
const JWTKey string = "d8f3a29c4e7b16f5c0a9d3b1e4f6782a"

// JWT valid time
const JWTTime time.Duration = 6

// Bot user id
const BotId int64 = 1

// Recommend number
const RecommendNum = 5
