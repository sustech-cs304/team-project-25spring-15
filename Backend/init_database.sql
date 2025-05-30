create database if not exists mysqlTest;
use mysqlTest;
DROP TABLE IF EXISTS ChatMessageInfo;
DROP TABLE IF EXISTS UserCourseInfo;
DROP TABLE IF EXISTS TestcaseAndAnswerFiles;
DROP TABLE IF EXISTS ChatUserInfo;
DROP TABLE IF EXISTS AssignmentUserFeedback;
DROP TABLE IF EXISTS UserFileInfo;
DROP TABLE IF EXISTS CourseAssistants;
DROP TABLE IF EXISTS LectureFiles;
DROP TABLE IF EXISTS LectureNoteFiles;
DROP TABLE IF EXISTS AssignmentFiles;
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS AIChatHistory;
DROP TABLE IF EXISTS Lectures;
DROP TABLE IF EXISTS Tasks;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Chats;
DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    userId BIGINT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    userSign TEXT,
    university VARCHAR(255),
    birthday TIMESTAMP,
    login INT DEFAULT 0,
    identity ENUM('teacher', 'student', 'superuser', 'bot') DEFAULT 'student'
);
CREATE TABLE Files (
    fileId BIGINT AUTO_INCREMENT PRIMARY KEY,
    fileSize BIGINT NOT NULL,
    fileUrl TEXT NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    fileType VARCHAR(50) NOT NULL,
    uploaderId BIGINT,
    uploadDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastModified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaderId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE Chats(
    chatId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ownerId BIGINT NOT NULL,
    chatName VARCHAR(50) NOT NULL ,
    FOREIGN KEY (ownerId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE Courses(
    courseId BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacherId BIGINT NOT NULL,
    courseName VARCHAR(255) NOT NULL,
    description VARCHAR(8191),
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    chatId BIGINT,
    FOREIGN KEY (chatId) REFERENCES Chats(chatId) ON DELETE CASCADE ,
    FOREIGN KEY (teacherId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE Lectures(
    lectureId INTEGER AUTO_INCREMENT PRIMARY KEY,
    courseId BIGINT NOT NULL,
    lectureName VARCHAR(255) NOT NULL,
    description VARCHAR(8191),
    FOREIGN KEY (courseId) REFERENCES Courses(courseId) ON DELETE CASCADE
);
CREATE TABLE Assignments(
    assignmentId BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignmentName VARCHAR(255) NOT NULL ,
    publisherId BIGINT NOT NULL,
    courseId BIGINT,
    lectureId INTEGER,
    description VARCHAR(8191),
    deadline TIMESTAMP,
    completeness INT,
    FOREIGN KEY (publisherId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES Courses(courseId) ON DELETE CASCADE,
    FOREIGN KEY (lectureId) REFERENCES Lectures(lectureId) ON DELETE CASCADE
);
-- CREATE TABLE Comments(
--     commentId INTEGER NOT NULL ,
--     fatherCommentId INTEGER DEFAULT 0,
--     subCommentId INTEGER DEFAULT 0,
--     courseId BIGINT,
--     lectureId INTEGER,
--     publisherId BIGINT,
--     comment_C VARCHAR(255) NOT NULL ,
--     FOREIGN KEY (courseId) REFERENCES Courses(courseId),
--     FOREIGN KEY (lectureId) REFERENCES Lectures(lectureId) ,
--     FOREIGN KEY (publisherId) REFERENCES Users(userId)
-- );
CREATE TABLE AssignmentUserFeedback(
    assignmentId BIGINT NOT NULL,
    performerId BIGINT NOT NULL,
    score INT,
    record VARCHAR(255) ,
    fileId BIGINT NOT NULL,
    fileType ENUM('txt', 'python', 'py', 'c', 'c++', 'cpp') default 'txt',
    PRIMARY KEY (assignmentId, performerId),
    FOREIGN KEY (assignmentId) REFERENCES Assignments(assignmentId) ON DELETE CASCADE,
    FOREIGN KEY (performerId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE UserCourseInfo(
    userId BIGINT NOT NULL,
    courseId BIGINT NOT NULL,
    identity ENUM('student', 'assistant', 'teacher') DEFAULT 'student',
    PRIMARY KEY(userId, courseId),
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES Courses(courseId) ON DELETE CASCADE
);
CREATE TABLE UserFileInfo(
    userId BIGINT NOT NULL,
    assignmentId BIGINT NOT NULL,
    fileId BIGINT NOT NULL,
    PRIMARY KEY (userId, assignmentId, fileId),
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (assignmentId) REFERENCES Assignments(assignmentId) ON DELETE CASCADE,
    FOREIGN KEY (fileId) REFERENCES Files(fileId) ON DELETE CASCADE
);
CREATE TABLE LectureFiles(
    fileId BIGINT NOT NULL,
    lectureId INTEGER NOT NULL,
    PRIMARY KEY (fileId, lectureId),
    FOREIGN KEY (fileId) REFERENCES Files(fileId) ON DELETE CASCADE,
    FOREIGN KEY (lectureId) REFERENCES Lectures(lectureId) ON DELETE CASCADE
);
CREATE TABLE LectureNoteFiles(
    fileId BIGINT NOT NULL,
    lectureId INTEGER NOT NULL,
    PRIMARY KEY (fileId, lectureId),
    FOREIGN KEY (fileId) REFERENCES Files(fileId) ON DELETE CASCADE,
    FOREIGN KEY (lectureId) REFERENCES Lectures(lectureId) ON DELETE CASCADE
);
# CREATE TABLE CourseAssistants(
#     courseId BIGINT NOT NULL,
#     assistantId BIGINT NOT NULL,
#     PRIMARY KEY (courseId, assistantId),
#     FOREIGN KEY (courseId) REFERENCES Courses(courseId) ON DELETE CASCADE,
#     FOREIGN KEY (assistantId) REFERENCES Users(userId) ON DELETE CASCADE
# );
CREATE TABLE AssignmentFiles(
    assignmentId BIGINT NOT NULL,
    ownerId BIGINT NOT NULL,
    fileId BIGINT NOT NULL,
    FOREIGN KEY (assignmentId) REFERENCES Assignments(assignmentId) ON DELETE CASCADE,
    FOREIGN KEY (ownerId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (fileId) REFERENCES Files(fileId) ON DELETE CASCADE
);
CREATE TABLE TestcaseAndAnswerFiles(
    testcaseAndAnswerId BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignmentId BIGINT NOT NULL,
    publisherId BIGINT NOT NULL,
    testcaseId BIGINT,
    answerId BIGINT,
    score INT DEFAULT 1,
    fileType ENUM('txt', 'python', 'c', 'c++', 'cpp') default 'txt',
    FOREIGN KEY (assignmentId) REFERENCES Assignments(assignmentId) ON DELETE CASCADE,
    FOREIGN KEY (publisherId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (testcaseId) REFERENCES Files(fileId) ON DELETE CASCADE,
    FOREIGN KEY (answerId) REFERENCES Files(fileId) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS AIChatHistory(
    chatId VARCHAR(63) PRIMARY KEY,
    lectureId INTEGER NOT NULL,
    userId BIGINT NOT NULL,
    role VARCHAR(127) NOT NULL ,
    parts VARCHAR(8191) NOT NULL ,
    createAt DATETIME DEFAULT NOW(),
    FOREIGN KEY (lectureId) REFERENCES Lectures(lectureId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE ChatUserInfo(
    userId BIGINT NOT NULL,
    chatId BIGINT NOT NULL,
    hasRead BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (userId, chatId),
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (chatId) REFERENCES Chats(chatId) ON DELETE CASCADE
);
CREATE TABLE ChatMessageInfo(
    messageId BIGINT AUTO_INCREMENT PRIMARY KEY,
    chatId BIGINT NOT NULL,
    ownerId BIGINT NOT NULL,
    message VARCHAR(255) NOT NULL,
    totalNum BIGINT,
    FOREIGN KEY (chatId) REFERENCES Chats(chatId) ON DELETE CASCADE,
    FOREIGN KEY (ownerId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE Comment (
  commentId BIGINT AUTO_INCREMENT PRIMARY KEY,
  repliedToCommentId BIGINT ,
  lectureId INTEGER NOT NULL ,
  authorId BIGINT NOT NULL,
  content VARCHAR(1023) NOT NUll,
  createTime VARCHAR(255) NOT NULL,
  likes BIGINT DEFAULT 0,
  FOREIGN KEY(authorId) REFERENCES Users(userId) ON DELETE CASCADE,
  FOREIGN KEY (lectureId) REFERENCES Lectures(lectureId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Tasks(
    taskId BIGINT AUTO_INCREMENT PRIMARY KEY ,
    targetApproverId BIGINT NOT NULL ,
    publisherId BIGINT NOT NULL ,
    publisherName VARCHAR(255) NOT NULL ,
    reviewerId BIGINT NOT NULL ,
    courseId BIGINT NOT NULL ,
    decision TINYINT DEFAULT 0,
    kind ENUM('join_course'),
    taskInfo VARCHAR(255),
    comment VARCHAR(255),
    FOREIGN KEY (targetApproverId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (publisherId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (reviewerId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES Courses(courseId) ON DELETE CASCADE
);

DROP TABLE IF EXISTS fuzzy_search_adv;
CREATE TABLE IF NOT EXISTS fuzzy_search_adv(
    fuzzy_search_id INT AUTO_INCREMENT PRIMARY KEY ,
    id BIGINT NOT NULL ,
    match_count BIGINT DEFAULT 0,
    info VARCHAR(255),
    name VARCHAR(255),
    source_table VARCHAR(255)
);

DROP FUNCTION IF EXISTS process_substring;
DELIMITER $$
CREATE FUNCTION process_substring(keyword TEXT)
RETURNS TEXT
DETERMINISTIC
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE len INT DEFAULT CHAR_LENGTH(keyword);
    DECLARE result TEXT DEFAULT '';
    WHILE i <= len DO
        IF i + 2 < len THEN
            SET result = CONCAT(result, ',', SUBSTRING(keyword, i, 2));
            SET i = i + 2;
        ELSE
            SET result = CONCAT(result, ',', SUBSTRING(keyword, i));
            SET i = len + 1;
        END IF;
    END WHILE;
    RETURN TRIM(BOTH ',' FROM result);
END$$

DELIMITER ;

DROP TABLE IF EXISTS temp_matches;
CREATE TEMPORARY TABLE temp_matches (
   source_table VARCHAR(50),
   id BIGINT,
   name VARCHAR(255),
   info VARCHAR(255),
   match_count BIGINT DEFAULT 0
);

DROP PROCEDURE IF EXISTS fuzzy_search;
DELIMITER $$

CREATE PROCEDURE fuzzy_search(IN keywordAll TEXT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE substring TEXT;
    DECLARE keyword TEXT;
    DECLARE temp_pattern TEXT;
    DECLARE split_cursor CURSOR FOR SELECT TRIM(split_part) FROM temp_keywords;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- 创建临时关键词表
    DROP TEMPORARY TABLE IF EXISTS temp_keywords;
    CREATE TEMPORARY TABLE temp_keywords (split_part TEXT);

    -- 清空表
    TRUNCATE temp_matches;
    TRUNCATE fuzzy_search_adv;

    -- 拆分 keywordAll，逐个处理
    WHILE LOCATE(',', keywordAll) > 0 DO
        SET substring = SUBSTRING_INDEX(keywordAll, ',', 1);
        SET keywordAll = SUBSTRING(keywordAll, LOCATE(',', keywordAll) + 1);

        SET @sub_keywords = process_substring(substring);

        WHILE LOCATE(',', @sub_keywords) > 0 DO
            INSERT INTO temp_keywords (split_part) VALUES (SUBSTRING_INDEX(@sub_keywords, ',', 1));
            SET @sub_keywords = SUBSTRING(@sub_keywords, LOCATE(',', @sub_keywords) + 1);
        END WHILE;
        INSERT INTO temp_keywords (split_part) VALUES (@sub_keywords);  -- 最后一个
    END WHILE;

    -- 处理最后一个关键词（如果没有逗号）
    IF CHAR_LENGTH(keywordAll) > 0 THEN
        SET @sub_keywords = process_substring(keywordAll);
        WHILE LOCATE(',', @sub_keywords) > 0 DO
            INSERT INTO temp_keywords (split_part) VALUES (SUBSTRING_INDEX(@sub_keywords, ',', 1));
            SET @sub_keywords = SUBSTRING(@sub_keywords, LOCATE(',', @sub_keywords) + 1);
        END WHILE;
        INSERT INTO temp_keywords (split_part) VALUES (@sub_keywords);
    END IF;

    -- 遍历关键词并执行模糊匹配
    OPEN split_cursor;
    read_loop: LOOP
        FETCH split_cursor INTO keyword;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SET temp_pattern = CONCAT('%', keyword, '%');

        -- 用户名
        INSERT INTO temp_matches
        SELECT 'User', userId, userName, userSign,
               IF(LOCATE(keyword, userName) > 0, 1, 0)
        FROM Users;

        -- 用户签名
        INSERT INTO temp_matches
        SELECT 'User', userId, userName, userSign,
               IF(LOCATE(keyword, userSign) > 0, 1, 0)
        FROM Users;

        -- 课程名
        INSERT INTO temp_matches
        SELECT 'Course', courseId, courseName, description,
               IF(LOCATE(keyword, courseName) > 0, 1, 0)
        FROM Courses;

        -- 课程描述
        INSERT INTO temp_matches
        SELECT 'Course', courseId, courseName, description,
               IF(LOCATE(keyword, description) > 0, 1, 0)
        FROM Courses;
    END LOOP;

    CLOSE split_cursor;

    -- 汇总写入 fuzzy_search_adv
    INSERT INTO fuzzy_search_adv (source_table, id, name, info, match_count)
    SELECT source_table, id, name, info, SUM(match_count)
    FROM temp_matches
    GROUP BY source_table, id, name, info;
END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS fuzzy_search_result_multi;
DELIMITER $$

CREATE PROCEDURE fuzzy_search_result_multi(IN keywordAll TEXT, IN source_list TEXT, IN limit_count INT)
BEGIN
    DECLARE src TEXT;

    -- 创建临时表存储分割后的 source_table
    DROP TEMPORARY TABLE IF EXISTS temp_source_list;
    CREATE TEMPORARY TABLE temp_source_list (source_table VARCHAR(50));

    CALL fuzzy_search(keywordAll);

    -- 拆分 source_list（如 'User,Course'）
    WHILE LOCATE(',', source_list) > 0 DO
        SET src = SUBSTRING_INDEX(source_list, ',', 1);
        INSERT INTO temp_source_list VALUES (TRIM(src));
        SET source_list = SUBSTRING(source_list, LOCATE(',', source_list) + 1);
    END WHILE;

    -- 插入最后一个
    IF CHAR_LENGTH(source_list) > 0 THEN
        INSERT INTO temp_source_list VALUES (TRIM(source_list));
    END IF;

    -- 如果传入为空，默认查询全部
    IF (SELECT COUNT(*) FROM temp_source_list) = 0 THEN
        SELECT * FROM fuzzy_search_adv
        WHERE match_count > 0
        ORDER BY match_count DESC LIMIT limit_count;
    ELSE
        -- 查询匹配的 source_table
        SELECT * FROM fuzzy_search_adv
        WHERE match_count > 0
          AND source_table IN (SELECT source_table FROM temp_source_list)
        ORDER BY match_count DESC LIMIT limit_count;
    END IF;
END$$

DELIMITER ;



insert into Users(userId, userName, password, email, identity)
VALUES (1, 'Y', '123456', 'Y1', 'superuser');
insert into Users(userId, userName, password, email, identity)
VALUES (2, 'Y', '123456', 'Y2', 'bot');
insert into Users(userId, userName, password, email, identity)
VALUES (3, 'Y', '12346', 'Y3', 'superuser');
insert into Users(userId, userName, password, email, identity)
VALUES (4, 'Y', '12346', 'Y4', 'student');
insert into Courses(COURSENAME, DESCRIPTION, teacherId)
values ('1', '1', 1);
insert into UserCourseInfo(USERID, COURSEID) VALUES (3, 1);
insert into Lectures(courseId, lectureName, description)
values (1, '1', '1');
insert into Users(userId, userName, password, email, identity)
VALUES (5, '5', '123456', '5', 'teacher');
insert into Users(userId, userName, password, email, identity)
VALUES (6, '6', '123456', '6', 'student');
insert into Users(userId, userName, password, email, identity)
VALUES (7, '7', '123456', '11111111@mail.sustech.edu.cn', 'student');
insert into Users(userId, userName, password, email, identity)
VALUES (11, '11', '123456', '44444444@mail.sustech.edu.cn', 'student');
insert into Users(userId, userName, password, email, identity)
VALUES (8, '8', '123456', '22222222@mail.sustech.edu.cn', 'teacher');
insert into Users(userId, userName, password, email, identity)
VALUES (9, '9', '123456', '33333333@mail.sustech.edu.cn', 'superuser');
insert into Courses(COURSENAME, DESCRIPTION, teacherId)
values ('2', '2', 8);
insert into Lectures(courseId, lectureName, description)
values (2, '2', '2');
insert into UserCourseInfo(USERID, COURSEID) VALUES (7, 1);
insert into Assignments(assignmentId, assignmentName, publisherId, courseId, lectureId) VALUES (1,'123',1,1,1);
insert into Files(fileId, fileSize, fileUrl, fileName, fileType) VALUES (1,1,'/usr/Document/testcase_1.txt','testcase_1', '1');
insert into Files(fileId, fileSize, fileUrl, fileName, fileType) VALUES (2,1,'/usr/Document/testcase_2.txt','testcase_2', '1');
insert into Files(fileId, fileSize, fileUrl, fileName, fileType) VALUES (3,1,'/usr/Document/answer_1.txt','answer_1', '1');
insert into Files(fileId, fileSize, fileUrl, fileName, fileType) VALUES (4,1,'/usr/Document/answer_2.txt','answer_2', '1');
insert into Files(fileId, fileSize, fileUrl, fileName, fileType) VALUES (5,1,'/usr/Document/attempt.py','attempt.py', '1');
insert into TestcaseAndAnswerFiles(testcaseAndAnswerId, assignmentId, publisherId, testcaseId, answerId, fileType) VALUES (1,1,1,1,3,'cpp');
insert into TestcaseAndAnswerFiles(testcaseAndAnswerId, assignmentId, publisherId, testcaseId, answerId, fileType) VALUES (2,1,1,2,4,'cpp');
insert into TestcaseAndAnswerFiles(testcaseAndAnswerId, assignmentId, publisherId, testcaseId, answerId, fileType, score) VALUES (3,1,1,2,3,'cpp',2);

select * from UserCourseInfo;

SHOW TABLE STATUS WHERE Name = 'AIChatHistory';
SHOW FULL COLUMNS FROM `AIChatHistory`;
ALTER TABLE AIChatHistory CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

select * from Files;
select * from AIChatHistory;

select * from TestcaseAndAnswerFiles;
select * from AssignmentUserFeedback;

insert into Users(userName, password, email, identity)
VALUES ('student1', '123456', 'student1@mail.sustech.edu.cn', 'student');
insert into Users(userName, password, email, identity)
VALUES ('student2', '123456', 'student2@mail.sustech.edu.cn', 'student');
insert into Users(userName, password, email, identity)
VALUES ('student3', '123456', 'student3@mail.sustech.edu.cn', 'student');
insert into Users(userName, password, email, identity)
VALUES ('teacher1', '123456', 'teacher1@mail.sustech.edu.cn', 'teacher');
insert into Users(userName, password, email, identity)
VALUES ('superuser1', '123456', 'superuser1@mail.sustech.edu.cn', 'superuser');

-- select * from Users;

-- insert into Courses(courseName, description, teacherId) values ('软件工程', '软件工程是一门研究用工程化方法构建和维护高质量软件的学科。它涉及程序设计语言、数据库、开发工具、系统平台等多个方面，主要包括三个要素：过程、方法和工具。软件工程的过程包括沟通、需求分析、设计、编程、测试和技术支持等步骤。此外，软件工程专业培养具备创新精神和实践能力的人才，毕业生可以在互联网、电子商务、教育等多个领域找到广泛的就业机会。', 15);
-- insert into Courses (courseName, description, teacherId) values ('数据挖掘', '数据挖掘是从大量的数据中，提取隐藏在其中的、事先不知道的、但潜在有用的信息的过程。数据挖掘的目标是建立一个决策模型，根据过去的行动数据来预测未来的行为。数据挖掘主要基于人工智能、机器学习、模式识别、统计学、数据库、可视化技术等，高度自动化地分析企业的数据，作出归纳性的推理，从中挖掘出潜在的模式，帮助决策者调整市场策略，减少风险，作出正确的决策。', 15);

-- select * from Courses;

-- insert into UserCourseInfo(userId, courseId, identity) values (15, 4, 'teacher');
-- insert into UserCourseInfo(userId, courseId, identity) values (15, 5, 'teacher');

-- insert into Lectures(lectureName, courseId, description) values ('软件工程简介', 4, '软件工程是一门研究用工程化方法构建和维护有效、实用和高质量的软件的学科。它涉及程序设计语言、数据库、软件开发工具、系统平台、标准、设计件有电子邮件、嵌入式系统、人机界面、办公套件、操作系统、编译器、数据库、游戏等。同时，各个行业几乎都有计算机软件的应用，如工业、农业、银行、航空、政府部门等。这些应用促进了经济和社会的发展，也提高了工作效率和生活效率 。');
-- insert into Lectures(lectureName, courseId, description) values ('软件工程流程', 4, '由于软件危机，人们意识到，把软件的质量于各个程序员的技能与认真负责是不可靠的、危险的、不现实的。要想大幅度的提高软件开发的质量和效率，就应当吸取传统产业的成功经验，从组织管理上加强，使软件生产从程序员的个人劳动提高成为有组织、可控制的工程——软件工程');
-- insert into Lectures(lectureName, courseId, description) values ('版本控制', 4, '版本控制是一种记录一个或若干文件内容变化，以便将来查阅特定版本修订情况的系统');
-- insert into Lectures(lectureName, courseId, description) values ('需求分析', 4, '需求分析是指通过分析用户或业务的需求，确定其目的和目标，并将这些需求转化为产品需求的过程');

