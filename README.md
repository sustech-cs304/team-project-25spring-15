# SUSTech-CS304-SoftwareEngineering-Intelligent-Course-Aware-IDE

## Set up
To run this project, you should first download two Docker Images: ```mysql:8.0``` and ```python```(In our test we use the 3.14 version). And please notice the following requirements:
1. the SQL in Backend\init_database.sql should be execute to create the table before run ```go run main.go```
2. the variables ```path``` and ```pathForDocker``` in Backend/intelligent-course-aware-ide/internal/controller/runner/runner_v1_python_runner.go need to be modified according to your Docker configuration
