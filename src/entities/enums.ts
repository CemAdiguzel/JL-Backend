export enum UserRole {
  User = "User",
  SuperUser = "SuperUser",
  Lecturer = "Lecturer",
}

export enum ContentType {
  BlogPost = "BlogPost",
  Quiz = "Quiz",
}

export const HIGH_GRADE_USER_ROLES = [UserRole.SuperUser, UserRole.Lecturer];

export enum Progression {
  NotStarted = "NotStarted",
  InProgress = "InProgress",
  Completed = "Completed",
}
