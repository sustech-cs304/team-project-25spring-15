create database if not exists mysqlTest;
use mysqlTest;
CREATE TABLE Users (
    userId BIGINT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    userSign TEXT,
    university VARCHAR(255),
    birthday TIMESTAMP
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
    FOREIGN KEY (uploaderId) REFERENCES Users(userId)
);
CREATE TABLE Courses(
    courseId BIGINT AUTO_INCREMENT PRIMARY KEY,
    courseName VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    startTime TIMESTAMP,
    endTime TIMESTAMP
);
CREATE TABLE Assignments(
    assignmentId BIGINT AUTO_INCREMENT PRIMARY KEY,
    publisherId BIGINT NOT NULL,
    courseId BIGINT,
    description VARCHAR(255),
    deadLine TIMESTAMP,
    completeness INT,
    FOREIGN KEY (ownerId) REFERENCES Users(userId),
    FOREIGN KEY (courseId) REFERENCES Courses(courseId),
);
CREATE TABLE Chats(
    chatId BIGINT AUTO_INCREMENT PRIMARY KEY,
    courseId BIGINT,
    ownerId BIGINT NOT NULL,
    FOREIGN KEY (ownerId) REFERENCES Users(userId),
    FOREIGN KEY (courseId) REFERENCES Courses(courseId)
);
CREATE TABLE AssignmentUserInfo(
    assignmentId BIGINT NOT NULL,
    performerId BIGINT NOT NULL,
    score INT DEFAULT 0,
    PRIMARY KEY (assignmentId, performerId)
    FOREIGN KEY (assignmentId) REFERENCES Assignments(assignmentId),
    FOREIGN KEY (performerId) REFERENCES Users(userId)
);
CREATE TABLE UserFileInfo(
    userId BIGINT NOT NULL,
    fileId BIGINT NOT NULL,
    authority INT NOT NULL,
    PRIMARY KEY (userId, fileId),
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (fileId) REFERENCES Files(fileId)
);
CREATE TABLE CourseFiles(
    fileId BIGINT NOT NULL,
    courseId BIGINT NOT NULL,
    PRIMARY KEY (fileId, courseId),
    FOREIGN KEY (fileId) REFERENCES Files(fileId),
    FOREIGN KEY (courseId) REFERENCES Courses(courseId)
);
CREATE TABLE AssignmentFiles(
    assignmentId BIGINT NOT NULL,
    ownerId BIGINT NOT NULL,
    fileId BIGINT NOT NULL,
    FOREIGN KEY (assignmentId) REFERENCES Assignments(assignmentId),
    FOREIGN KEY (ownerId) REFERENCES Users(userId),
    FOREIGN KEY (fileId) REFERENCES Files(fileId)
);
CREATE TABLE TestcaseAndAnswerFiles(
    assignmentId BIGINT NOT NULL,
    ownerId BIGINT NOT NULL,
    testcaseId BIGINT,
    answerId BIGINT,
    FOREIGN KEY (assignmentId) REFERENCES Assignments(assignmentId),
    FOREIGN KEY (ownerId) REFERENCES Users(userId),
    FOREIGN KEY (testcaseId) REFERENCES Files(fileId),
    FOREIGN KEY (answerId) REFERENCES Files(fileId)
)
CREATE TABLE ChatUserInfo(
    userId BIGINT NOT NULL,
    chatId BIGINT NOT NULL,
    PRIMARY KEY (userId, chatId),
    FOREIGN KEY (userId) REFERENCES Users(userId),
    FOREIGN KEY (chatId) REFERENCES Chats(chatId)
);
CREATE TABLE ChatMessageInfo(
    messageId BIGINT AUTO_INCREMENT PRIMARY KEY,
    chatId BIGINT NOT NULL,
    ownerId BIGINT NOT NULL,
    message VARCHAR(255) NOT NULL,
    FOREIGN KEY (chatId) REFERENCES Chats(chatId),
    FOREIGN KEY (ownerId) REFERENCES Users(userId)
)