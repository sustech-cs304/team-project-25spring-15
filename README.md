# SUSTech-CS304-SoftwareEngineering-Intelligent-Course-Aware-IDE

## Set up

#### Docker install:

In this project, we use 3 dockers to isolate code and maintain the database. To run this project, you also should run the following dockers or modify the code.

1. mysql:8.0
2. python:3.13.2
3. gcc:14.2.0

To run a docker, you could follow the following steps:

1. docker pull {image name}
2. docker run -d -it --name {container name} -v {working/path/on/the/host}:{working/path/on/the/docker} {image name}

Please notice the following requirements:

1. the SQL in Backend\init_database.sql should be execute to create the table before run ``go run main.go``
2. the variables ``path`` and ``pathForDocker`` in Backend/intelligent-course-aware-ide/internal/controller/runner/runner_v1_python_runner.go need to be modified according to your Docker configuration
