create database if not exists mysqlTest;
use mysqlTest;
DROP TABLE IF EXISTS ChatMessageInfo;
DROP TABLE IF EXISTS TestcaseAndAnswerFiles;
DROP TABLE IF EXISTS ChatUserInfo;
DROP TABLE IF EXISTS AssignmentUserFeedback;
DROP TABLE IF EXISTS UserFileInfo;
DROP TABLE IF EXISTS CourseAssistants;
DROP TABLE IF EXISTS LectureFiles;
DROP TABLE IF EXISTS AssignmentFiles;
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Lectures;
DROP TABLE IF EXISTS Chats;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    userId BIGINT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    userSign TEXT,
    university VARCHAR(255),
    birthday TIMESTAMP,
    identity ENUM('teacher', 'student', 'superuser') DEFAULT 'student'
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
CREATE TABLE Courses(
    courseId BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacherId BIGINT NOT NULL,
    courseName VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    startTime TIMESTAMP,
    endTime TIMESTAMP,
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
CREATE TABLE Comments(
    commentId INTEGER NOT NULL,
    fatherCommentId INTEGER DEFAULT 0,
    subCommentId INTEGER DEFAULT 0,
    courseId BIGINT,
    lectureId INTEGER,
    publisherId BIGINT,
    comment VARCHAR(255) NOT NULL,
    FOREIGN KEY (courseId) REFERENCES Courses(courseId) ON DELETE CASCADE,
    FOREIGN KEY (lectureId) REFERENCES Lectures(lectureId) ON DELETE CASCADE,
    FOREIGN KEY (publisherId) REFERENCES Users(userId) ON DELETE CASCADE
);
CREATE TABLE Chats(
    chatId BIGINT AUTO_INCREMENT PRIMARY KEY,
    ownerId BIGINT NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES Users(userId) ON DELETE CASCADE
);
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
    fileType ENUM('string', 'code') DEFAULT 'string',
    FOREIGN KEY (assignmentId) REFERENCES Assignments(assignmentId) ON DELETE CASCADE,
    FOREIGN KEY (publisherId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (testcaseId) REFERENCES Files(fileId) ON DELETE CASCADE,
    FOREIGN KEY (answerId) REFERENCES Files(fileId) ON DELETE CASCADE
);
CREATE TABLE ChatUserInfo(
    userId BIGINT NOT NULL,
    chatId BIGINT NOT NULL,
    PRIMARY KEY (userId, chatId),
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (chatId) REFERENCES Chats(chatId) ON DELETE CASCADE
);
CREATE TABLE ChatMessageInfo(
    messageId BIGINT AUTO_INCREMENT PRIMARY KEY,
    chatId BIGINT NOT NULL,
    ownerId BIGINT NOT NULL,
    message VARCHAR(255) NOT NULL,
    FOREIGN KEY (chatId) REFERENCES Chats(chatId) ON DELETE CASCADE,
    FOREIGN KEY (ownerId) REFERENCES Users(userId) ON DELETE CASCADE
);
insert into Users(userId, userName, password, email, identity)
VALUES (1, 'Y', '123456', 'Y', 'superuser');
insert into Courses(COURSENAME, DESCRIPTION, teacherId)
values ('1', '1', 1);
insert into Lectures(courseId, lectureName, description)
values (1, '1', '1');
insert into Users(userId, userName, password, email, identity)
VALUES (5, '5', '123456', '5', 'teacher');
insert into Users(userId, userName, password, email, identity)
VALUES (6, '6', '123456', '6', 'student');
select *
from Courses;
select *
from CourseAssistants;