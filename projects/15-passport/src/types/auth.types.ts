// src/types/auth.types.ts
export interface LocalUserData {
  userId: number;
  username: string;
}

export interface GithubUserData {
  id: string;
  displayName: string;
  username: string;
  photos: Array<{ value: string }>;
  // 其他 GitHub Profile 字段
}

// 统一的用户类型
export type UserData = LocalUserData | GithubUserData;

// 扩展 Express Request 类型
declare module 'express' {
  interface Request {
    user: UserData;
  }
}
