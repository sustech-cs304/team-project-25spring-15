# docker database connect

    powershell (administer) :
        1. 关闭 vscode
        2. 关闭 vpn
        3. wsl --shutdown
        4. wsl -d docker-desktop （在wsl处手动启动docker）
        5. 打开docker-desktop

    // docker run -d -it --name CS304 -v /mnt/e/SUSTech_CS_Class/Software_engineering/project/team-project-25spring-15/tmp:/usr/Document -p 3306:3306 y261/sustech_cs304_25_group15:1.0.0

    docker start CS304

    docker exec -it CS304 bash

    service mysql start

    mysql -u Y -p

    123456

    use mysqlTest
