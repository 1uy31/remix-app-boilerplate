import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

import { createUserConnector, UserConnector } from '~/database/user.connector';

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set!');
}
const storage = createCookieSessionStorage({
  cookie: {
    name: 'RJ_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [SESSION_SECRET],
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
  },
});

const redirectWithAttachedSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
};

export const register = async (
  username: string,
  password: string,
  redirectTo: string,
  userConnector: UserConnector = createUserConnector(),
) => {
  const user = await userConnector.getByUsername(username);
  if (user) throw new Error(`User with username ${username} already exists!`);
  const newUser = await userConnector.create(username, password);
  return redirectWithAttachedSession(newUser.id, redirectTo);
};

export const login = async (
  username: string,
  password: string,
  redirectTo: string,
  userConnector: UserConnector = createUserConnector(),
) => {
  const user = await userConnector.getByUsername(username);
  if (!user) throw new Error(`User with username ${username} does not exist!`);
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) throw new Error(`Password is incorrect!`);
  return redirectWithAttachedSession(user.id, redirectTo);
};

const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'));
};

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
};

export const requireUserId = async (request: Request, redirectTo: string = new URL(request.url).pathname) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (userId && typeof userId === 'string') return userId;

  const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
  throw redirect(`/login?${searchParams}`);
};
