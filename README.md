# SUSTech-CS304-SoftwareEngineering-Intelligent-Course-Aware-IDE

## 1. Set up

#### Backend:

We use Docker to islate the code sent by frontend and we will also try to use docker to deploy the IDE.

Up to 2025-04-16, if you want to run backend, you should follow the following steps:

1. Download Docker Desktop and pull image from y261/sustech_CS304_25_group 15:1.0.0
2. Open Docker server and execute ``docker run -d -it --name CS304 -v {path}:/usr/Document -p 3306:3306 y261/sustech_cs304_25_group15:1.0.0`` in cmd.**Attention: Here you should replace the {place} to the path you want to store the scrips**
3. Run ``python server_setup.py``in Backend\intelligent-course-aware-ide or run the following command in cmd:
   step1: ``docker start CS304``
   step2:``docker exec CS304 server mysql start``
   step3:``go run main.go``in Backend\intelligent-course-aware-ide

Here is the version of critical packages we install in the image:

1. mysql: Ver 8.0.41-0ubuntu0.22.04.1 for Linux on x86_64 ((Ubuntu))
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

+ test
+ 123
