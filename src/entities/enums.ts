export enum UserRole {
  User = "User",
  SuperUser = "SuperUser",
  Lecturer = "Lecturer",
}

export const HIGH_GRADE_USER_ROLES = [UserRole.SuperUser, UserRole.Lecturer];
