import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect, SessionStorage } from '@remix-run/node';

import { createUserConnector, UserConnector } from '~/database/userConnector';
import { globalStorage } from '~/sessionStorage';

export type AuthService = {
  /**
   * Register and return username.
   */
  register: (username: string, password: string) => Promise<string>;
  /**
   * Login and return username.
   */
  login: (username: string, password: string) => Promise<string>;
  getUsernameByCookie: (cookie: string | null) => Promise<string | undefined>;
};

export const createAuthService = (
  storage: SessionStorage = globalStorage,
  userConnector: UserConnector = createUserConnector(),
): AuthService => {
  const register = async (username: string, password: string): Promise<string> => {
    const user = await userConnector.getByUsername(username);
    if (user) throw new Error(`User with username ${username} already exists!`);
    const newUser = await userConnector.create(username, password);
    return newUser.username;
  };

  const login = async (username: string, password: string): Promise<string> => {
    const user = await userConnector.getByUsername(username);
    if (!user) throw new Error(`User with username ${username} does not exist!`);
    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isCorrectPassword) throw new Error(`Password is incorrect!`);
    return user.username;
  };

  const getUsernameByCookie = async (cookie: string | null): Promise<string | undefined> => {
    const userSession = await storage.getSession(cookie);
    const username = userSession.get('username');
    if (!username || typeof username !== 'string') return undefined;

    try {
      const user = await userConnector.getByUsername(username);
      return user?.username;
    } catch (err: any) {
      console.error('services/auth.getUsernameByCookie', err);
      return undefined;
    }
  };

  return {
    register,
    login,
    getUsernameByCookie,
  };
};
