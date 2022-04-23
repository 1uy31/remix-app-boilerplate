import { redirect, SessionStorage } from '@remix-run/node';
import { ZodIssue } from 'zod';
import { globalStorage } from './sessionStorage';

export const throwIfUndefined = (value: any, errorMessage?: string): any => {
  if (value === undefined) {
    throw new Error(errorMessage || `Unexpected undefined value ${value}!`);
  }
  return value;
};

/**
 * Get error message of desired field from a list of ZodIssue.
 */
export const getMessageFromZodIssues = (issues: Array<ZodIssue>, field: string): string | undefined => {
  return issues.find((issue) => issue.path.includes(field))?.message;
};

const getUserSession = (request: Request, storage: SessionStorage = globalStorage) => {
  return storage.getSession(request.headers.get('Cookie'));
};

export const redirectWithAttachedSession = async (
  username: string,
  redirectTo: string,
  storage: SessionStorage = globalStorage,
): Promise<Response> => {
  const session = await storage.getSession();
  session.set('username', username);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
};

export const redirectWithClearedSession = async (
  request: Request,
  redirectTo: string,
  storage: SessionStorage = globalStorage,
): Promise<Response> => {
  const session = await getUserSession(request);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
};

const requireUserId = async (request: Request, redirectTo: string = new URL(request.url).pathname) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (userId && typeof userId === 'string') return userId;

  const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
  throw redirect(`/login?${searchParams}`);
};
