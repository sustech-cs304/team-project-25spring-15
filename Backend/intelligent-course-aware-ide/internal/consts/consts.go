package consts

import "time"

// Operation url
const TargetUrl string = "http://47.117.144.50:8000"

// Database dockerName
const TargetDockerName string = "CS304"

// Python dockerName
const TargetPythonDockerName string = TargetDockerName

// C/C++ dockerName
const TargetCDockerName string = TargetDockerName

// Default name of script
const TmpFileName string = "temp_script"

// Default path of script on host
const PathForHost string = "C:\\Users\\sunyy\\Desktop\\SUSTECH\\Software_Engineering\\code\\Project\\team-project-25spring-15\\tmp\\"

// Default path of script on docker
const PathForDocker string = "/usr/Document/"

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
