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
DROP TABLE IF EXISTS AssignmentFiles;
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Comments;
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
    chatName VARCHAR(50) NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE Courses(
    courseId BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacherId BIGINT NOT NULL,
    courseName VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    chatId BIGINT,
    FOREIGN KEY (chatId) REFERENCES Chats(chatId) ON DELETE CASCADE,
    FOREIGN KEY (teacherId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE Lectures(
    lectureId INTEGER AUTO_INCREMENT PRIMARY KEY,
    courseId BIGINT NOT NULL,
    lectureName VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (courseId) REFERENCES Courses(courseId) ON DELETE CASCADE
);
CREATE TABLE Assignments(
    assignmentId BIGINT AUTO_INCREMENT PRIMARY KEY,
    publisherId BIGINT NOT NULL,
    courseId BIGINT,
    lectureId INTEGER,
    description VARCHAR(255),
    deadLine TIMESTAMP,
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
    fileId BIGINT NOT NULL,
    fileType ENUM('string', 'python', 'c', 'c++', 'cpp') default 'string',
    PRIMARY KEY (assignmentId, performerId),
    FOREIGN KEY (assignmentId) REFERENCES Assignments(assignmentId) ON DELETE CASCADE,
    FOREIGN KEY (performerId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE UserCourseInfo(
    userId BIGINT NOT NULL,
    courseId BIGINT NOT NULL,
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
CREATE TABLE CourseAssistants(
    courseId BIGINT NOT NULL,
    assistantId BIGINT NOT NULL,
    PRIMARY KEY (courseId, assistantId),
    FOREIGN KEY (courseId) REFERENCES Courses(courseId) ON DELETE CASCADE,
    FOREIGN KEY (assistantId) REFERENCES Users(userId) ON DELETE CASCADE
);
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
    fileType ENUM('string', 'code') DEFAULT 'string',
    FOREIGN KEY (assignmentId) REFERENCES Assignments(assignmentId) ON DELETE CASCADE,
    FOREIGN KEY (publisherId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (testcaseId) REFERENCES Files(fileId) ON DELETE CASCADE,
    FOREIGN KEY (answerId) REFERENCES Files(fileId) ON DELETE CASCADE
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
    repliedToCommentedId BIGINT,
    lectureId BIGINT,
    authorId BIGINT NOT NULL,
    content VARCHAR(1023) NOT NUll,
    createTime VARCHAR(255) NOT NULL,
    likes BIGINT,
    FOREIGN KEY(authorId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE SharedFiles (
    sharedFileId BIGINT PRIMARY KEY,
    sharedLogId BIGINT NOT NULL,
    FOREIGN KEY(SharedFileId) REFERENCES Files(fileId) ON DELETE CASCADE,
    FOREIGN KEY(SharedLogId) REFERENCES Files(fileId) ON DELETE CASCADE
);
CREATE TABLE SharedFilePartners (
    sharedFileId BIGINT NOT NULL,
    userId BIGINT NOT NULL,
    isOnline BIGINT NOT NULL,
    isManager BIGINT NOT NULL,
    PRIMARY KEY(sharedFileId, userId),
    FOREIGN KEY(SharedFileId) REFERENCES Files(fileId) ON DELETE CASCADE,
    FOREIGN KEY(UserId) REFERENCES User(userId) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS Tasks(
    taskId BIGINT AUTO_INCREMENT PRIMARY KEY,
    targetApproverId BIGINT NOT NULL,
    publisherId BIGINT NOT NULL,
    publisherName VARCHAR(255) NOT NULL,
    reviewerId BIGINT NOT NULL,
    courseId BIGINT NOT NULL,
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
    fuzzy_search_id INT AUTO_INCREMENT PRIMARY KEY,
    id BIGINT NOT NULL,
    match_count BIGINT DEFAULT 0,
    info VARCHAR(255),
    name VARCHAR(255),
    source_table VARCHAR(255)
);
DROP FUNCTION IF EXISTS process_substring;
DELIMITER $$ CREATE FUNCTION process_substring(keyword TEXT) RETURNS TEXT DETERMINISTIC BEGIN
DECLARE i INT DEFAULT 1;
DECLARE len INT DEFAULT CHAR_LENGTH(keyword);
DECLARE result TEXT DEFAULT '';
WHILE i <= len DO IF i + 2 < len THEN
SET result = CONCAT(result, ',', SUBSTRING(keyword, i, 2));
SET i = i + 2;
ELSE
SET result = CONCAT(result, ',', SUBSTRING(keyword, i));
SET i = len + 1;
END IF;
END WHILE;
RETURN TRIM(
    BOTH ','
    FROM result
);
END $$ DELIMITER;
DROP TABLE IF EXISTS temp_matches;
CREATE TEMPORARY TABLE temp_matches (
    source_table VARCHAR(50),
    id BIGINT,
    name VARCHAR(255),
    info VARCHAR(255),
    match_count BIGINT DEFAULT 0
);
DROP PROCEDURE IF EXISTS fuzzy_search;
DELIMITER $$ CREATE PROCEDURE fuzzy_search(IN keywordAll TEXT) BEGIN
DECLARE done INT DEFAULT FALSE;
DECLARE substring TEXT;
DECLARE keyword TEXT;
DECLARE temp_pattern TEXT;
DECLARE split_cursor CURSOR FOR
SELECT TRIM(split_part)
FROM temp_keywords;
DECLARE CONTINUE HANDLER FOR NOT FOUND
SET done = TRUE;
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
INSERT INTO temp_keywords (split_part)
VALUES (SUBSTRING_INDEX(@sub_keywords, ',', 1));
SET @sub_keywords = SUBSTRING(@sub_keywords, LOCATE(',', @sub_keywords) + 1);
END WHILE;
INSERT INTO temp_keywords (split_part)
VALUES (@sub_keywords);
-- 最后一个
END WHILE;
-- 处理最后一个关键词（如果没有逗号）
IF CHAR_LENGTH(keywordAll) > 0 THEN
SET @sub_keywords = process_substring(keywordAll);
WHILE LOCATE(',', @sub_keywords) > 0 DO
INSERT INTO temp_keywords (split_part)
VALUES (SUBSTRING_INDEX(@sub_keywords, ',', 1));
SET @sub_keywords = SUBSTRING(@sub_keywords, LOCATE(',', @sub_keywords) + 1);
END WHILE;
INSERT INTO temp_keywords (split_part)
VALUES (@sub_keywords);
END IF;
-- 遍历关键词并执行模糊匹配
OPEN split_cursor;
read_loop: LOOP FETCH split_cursor INTO keyword;
IF done THEN LEAVE read_loop;
END IF;
SET temp_pattern = CONCAT('%', keyword, '%');
-- 用户名
INSERT INTO temp_matches
SELECT 'User',
    userId,
    userName,
    userSign,
    IF(LOCATE(keyword, userName) > 0, 1, 0)
FROM Users;
-- 用户签名
INSERT INTO temp_matches
SELECT 'User',
    userId,
    userName,
    userSign,
    IF(LOCATE(keyword, userSign) > 0, 1, 0)
FROM Users;
-- 课程名
INSERT INTO temp_matches
SELECT 'Course',
    courseId,
    courseName,
    description,
    IF(LOCATE(keyword, courseName) > 0, 1, 0)
FROM Courses;
-- 课程描述
INSERT INTO temp_matches
SELECT 'Course',
    courseId,
    courseName,
    description,
    IF(LOCATE(keyword, description) > 0, 1, 0)
FROM Courses;
END LOOP;
CLOSE split_cursor;
-- 汇总写入 fuzzy_search_adv
INSERT INTO fuzzy_search_adv (source_table, id, name, info, match_count)
SELECT source_table,
    id,
    name,
    info,
    SUM(match_count)
FROM temp_matches
GROUP BY source_table,
    id,
    name,
    info;
END $$ DELIMITER;
DROP PROCEDURE IF EXISTS fuzzy_search_result_multi;
DELIMITER $$ CREATE PROCEDURE fuzzy_search_result_multi(
    IN keywordAll TEXT,
    IN source_list TEXT,
    IN limit_count INT
) BEGIN
DECLARE src TEXT;
-- 创建临时表存储分割后的 source_table
DROP TEMPORARY TABLE IF EXISTS temp_source_list;
CREATE TEMPORARY TABLE temp_source_list (source_table VARCHAR(50));
CALL fuzzy_search(keywordAll);
-- 拆分 source_list（如 'User,Course'）
WHILE LOCATE(',', source_list) > 0 DO
SET src = SUBSTRING_INDEX(source_list, ',', 1);
INSERT INTO temp_source_list
VALUES (TRIM(src));
SET source_list = SUBSTRING(source_list, LOCATE(',', source_list) + 1);
END WHILE;
-- 插入最后一个
IF CHAR_LENGTH(source_list) > 0 THEN
INSERT INTO temp_source_list
VALUES (TRIM(source_list));
END IF;
-- 如果传入为空，默认查询全部
IF (
    SELECT COUNT(*)
    FROM temp_source_list
) = 0 THEN
SELECT *
FROM fuzzy_search_adv
WHERE match_count > 0
ORDER BY match_count DESC
LIMIT limit_count;
ELSE -- 查询匹配的 source_table
SELECT *
FROM fuzzy_search_adv
WHERE match_count > 0
    AND source_table IN (
        SELECT source_table
        FROM temp_source_list
    )
ORDER BY match_count DESC
LIMIT limit_count;
END IF;
END $$ DELIMITER;
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
insert into UserCourseInfo(USERID, COURSEID)
VALUES (3, 1);
insert into Lectures(courseId, lectureName, description)
values (1, '1', '1');
insert into Users(userId, userName, password, email, identity)
VALUES (5, '5', '123456', '5', 'teacher');
insert into Users(userId, userName, password, email, identity)
VALUES (6, '6', '123456', '6', 'student');
insert into Users(userId, userName, password, email, identity)
VALUES (
        7,
        '7',
        '123456',
        '11111111@mail.sustech.edu.cn',
        'student'
    );
insert into Assignments(assignmentId, publisherId, courseId, lectureId)
VALUES (1, 1, 1, 1);
insert into Files(fileId, fileSize, fileUrl, fileName, fileType)
VALUES (
        1,
        1,
        '/usr/Document/testcase_1.txt',
        'testcase_1',
        '1'
    );
insert into Files(fileId, fileSize, fileUrl, fileName, fileType)
VALUES (
        2,
        1,
        '/usr/Document/testcase_2.txt',
        'testcase_2',
        '1'
    );
insert into Files(fileId, fileSize, fileUrl, fileName, fileType)
VALUES (
        3,
        1,
        '/usr/Document/answer_1.txt',
        'answer_1',
        '1'
    );
insert into Files(fileId, fileSize, fileUrl, fileName, fileType)
VALUES (
        4,
        1,
        '/usr/Document/answer_2.txt',
        'answer_2',
        '1'
    );
insert into Files(fileId, fileSize, fileUrl, fileName, fileType)
VALUES (
        5,
        1,
        '/usr/Document/attempt.py',
        'attempt.py',
        '1'
    );
insert into TestcaseAndAnswerFiles(
        testcaseAndAnswerId,
        assignmentId,
        publisherId,
        testcaseId,
        answerId,
        fileType
    )
VALUES (1, 1, 1, 1, 3, 'code');
insert into TestcaseAndAnswerFiles(
        testcaseAndAnswerId,
        assignmentId,
        publisherId,
        testcaseId,
        answerId,
        fileType
    )
VALUES (2, 1, 1, 2, 4, 'code');
insert into TestcaseAndAnswerFiles(
        testcaseAndAnswerId,
        assignmentId,
        publisherId,
        testcaseId,
        answerId,
        fileType,
        score
    )
VALUES (3, 1, 1, 2, 3, 'code', 2);
select *
from Courses;
call fuzzy_search_result_multi('1,Y,', '', 10);