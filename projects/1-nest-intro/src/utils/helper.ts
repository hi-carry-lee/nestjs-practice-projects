export function sanitizePatch<T extends Record<string, any>>(
  patch: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== null && v !== undefined),
  ) as Partial<T>;
}
