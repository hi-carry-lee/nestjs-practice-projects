export interface JwtPayload {
  sub: number | string; // 用户唯一ID，常见写法
  username?: string; // 可选字段，实际token内容
  roles?: string[]; // 或 Role[]，配合角色系统
  email?: string;
  // ... 其它你 JWT token 实际包含的信息
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
