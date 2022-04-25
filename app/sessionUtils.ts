import { redirect, SessionStorage } from '@remix-run/node';
import { globalStorage } from './sessionStorage';

const getUserSession = (request: Request, storage: SessionStorage = globalStorage) => {
  return storage.getSession(request.headers.get('Cookie'));
};

/**
 * Using username as the key to store user's session data, and redirect to desired location.
 */
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

/**
 * Destroy user's associated session (log user out), and redirect to desired location.
 */
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
