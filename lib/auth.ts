import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'intelworld-secret-key-change-in-production'
);

export interface UserPayload {
  uuid: string;
  username: string;
  role?: string;
  roles?: string[];
  [key: string]: any;
}

export async function createToken(payload: UserPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

export async function verifyAuth(request: Request): Promise<{ valid: boolean; payload?: UserPayload }> {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return { valid: false };
    }

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const token = cookies['auth_token'];
    if (!token) {
      return { valid: false };
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false };
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}
