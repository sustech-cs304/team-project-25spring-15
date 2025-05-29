import { UserInfo } from './definitions';

/**
 * 权限管理工具类
 */
export class PermissionManager {
  /**
   * 检查用户是否是课程的教师
   * @param userInfo 用户信息
   * @param teacherId 课程教师ID
   * @returns 是否是教师
   */
  static isTeacher(userInfo: UserInfo | null, teacherId?: number): boolean {
    return userInfo?.identity === 'teacher' && userInfo.userId === teacherId;
  }

  /**
   * 检查用户是否是助教
   * @param courseIdentity 课程身份标识
   * @returns 是否是助教
   */
  static isAssistant(courseIdentity: string | null): boolean {
    return courseIdentity === 'assistant';
  }

  /**
   * 检查用户是否可以管理课程（教师或助教）
   * @param userInfo 用户信息
   * @param teacherId 课程教师ID
   * @param courseIdentity 课程身份标识
   * @returns 是否可以管理
   */
  static canManageCourse(
    userInfo: UserInfo | null,
    teacherId?: number,
    courseIdentity?: string | null
  ): boolean {
    return this.isTeacher(userInfo, teacherId) || this.isAssistant(courseIdentity || null);
  }

  /**
   * 检查用户是否可以删除课程（只有教师可以）
   * @param userInfo 用户信息
   * @param teacherId 课程教师ID
   * @returns 是否可以删除
   */
  static canDeleteCourse(userInfo: UserInfo | null, teacherId?: number): boolean {
    return this.isTeacher(userInfo, teacherId);
  }

  /**
   * 检查用户是否可以添加/编辑练习（教师和助教都可以）
   * @param userInfo 用户信息
   * @param teacherId 课程教师ID
   * @param courseIdentity 课程身份标识
   * @returns 是否可以添加/编辑练习
   */
  static canEditExercise(
    userInfo: UserInfo | null,
    teacherId?: number,
    courseIdentity?: string | null
  ): boolean {
    return this.canManageCourse(userInfo, teacherId, courseIdentity || null);
  }

  /**
   * 检查用户是否可以添加测试用例（教师和助教都可以）
   * @param userInfo 用户信息
   * @param teacherId 课程教师ID
   * @param courseIdentity 课程身份标识
   * @returns 是否可以添加测试用例
   */
  static canAddTestCase(
    userInfo: UserInfo | null,
    teacherId?: number,
    courseIdentity?: string | null
  ): boolean {
    return this.canManageCourse(userInfo, teacherId, courseIdentity || null);
  }

  /**
   * 检查用户是否可以管理学生（教师和助教都可以）
   * @param userInfo 用户信息
   * @param teacherId 课程教师ID
   * @param courseIdentity 课程身份标识
   * @returns 是否可以管理学生
   */
  static canManageStudents(
    userInfo: UserInfo | null,
    teacherId?: number,
    courseIdentity?: string | null
  ): boolean {
    return this.canManageCourse(userInfo, teacherId, courseIdentity || null);
  }

  /**
   * 检查用户是否可以查看所有学生提交记录（教师和助教都可以）
   * @param userInfo 用户信息
   * @param teacherId 课程教师ID
   * @param courseIdentity 课程身份标识
   * @returns 是否可以查看所有提交记录
   */
  static canViewAllSubmissions(
    userInfo: UserInfo | null,
    teacherId?: number,
    courseIdentity?: string | null
  ): boolean {
    return this.canManageCourse(userInfo, teacherId, courseIdentity || null);
  }
}

/**
 * 用于React组件的权限Hook
 */
export const usePermissions = (
  userInfo: UserInfo | null,
  teacherId?: number,
  courseIdentity?: string | null
) => {
  return {
    isTeacher: PermissionManager.isTeacher(userInfo, teacherId),
    isAssistant: PermissionManager.isAssistant(courseIdentity || null),
    canManageCourse: PermissionManager.canManageCourse(userInfo, teacherId, courseIdentity || null),
    canDeleteCourse: PermissionManager.canDeleteCourse(userInfo, teacherId),
    canEditExercise: PermissionManager.canEditExercise(userInfo, teacherId, courseIdentity || null),
    canAddTestCase: PermissionManager.canAddTestCase(userInfo, teacherId, courseIdentity || null),
    canManageStudents: PermissionManager.canManageStudents(userInfo, teacherId, courseIdentity || null),
    canViewAllSubmissions: PermissionManager.canViewAllSubmissions(userInfo, teacherId, courseIdentity || null),
  };
}; 