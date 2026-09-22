export function normalizeEmail(value: string): string {
  return String(value || "").trim();
}

export function isValidEmailAddress(value: string): boolean {
  const email = normalizeEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isEducationEmail(value: string): boolean {
  const email = normalizeEmail(value).toLowerCase();
  return email.endsWith(".edu.cn") || email.endsWith(".edu");
}
