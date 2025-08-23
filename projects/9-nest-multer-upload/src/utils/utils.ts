export function safeStringify(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (value instanceof Error) return value.stack || value.message;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      // JSON.stringify失败，强制转换为字符串（已经是最后手段）
      // 先转unknown再断言
      // return String(value as unknown as string);
      // 推荐这个方案
      return '[Unserializable Object]'; // 避免强制转换
    }
  }
  return String(value as string | number | boolean);
}
