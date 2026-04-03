interface JwtPayload {
  exp?: number;
  role?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function decodeBase64Url(segment: string): string | null {
  try {
    const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = padded + '='.repeat((4 - (padded.length % 4)) % 4);
    return atob(normalized);
  } catch {
    return null;
  }
}

export function parseJwtPayload(token: string): JwtPayload | null {
  const segments = token.split('.');
  if (segments.length !== 3) return null;

  const decoded = decodeBase64Url(segments[1]);
  if (!decoded) return null;

  try {
    const parsed: unknown = JSON.parse(decoded);
    if (!isRecord(parsed)) return null;

    return {
      exp: typeof parsed.exp === 'number' ? parsed.exp : undefined,
      role: typeof parsed.role === 'string' ? parsed.role : undefined,
    };
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now();
}

export function getTokenRole(token: string): string | null {
  const payload = parseJwtPayload(token);
  return payload?.role ?? null;
}

