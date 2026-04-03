import type { AdminUser } from '../types/product';

const TOKEN_STORAGE_KEY = 'admin_token';
const USER_STORAGE_KEY = 'admin_user';

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAdminUser(value: unknown): value is AdminUser {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'number' &&
    typeof value.email === 'string' &&
    typeof value.name === 'string' &&
    typeof value.role === 'string'
  );
}

export function getStoredToken(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredUser(): AdminUser | null {
  if (!canUseStorage()) return null;
  const rawUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!rawUser) return null;

  try {
    const parsed: unknown = JSON.parse(rawUser);
    return isAdminUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: AdminUser): void {
  if (!canUseStorage()) return;

  // Security note: we currently persist JWT in localStorage because the backend
  // login flow returns tokens in JSON instead of setting an httpOnly cookie.
  // This increases XSS risk and must be revisited when cookie-based auth is available.
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredSession(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}
