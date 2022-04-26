import { SessionStorage } from '@remix-run/node';
import sinon from 'sinon';

export const createMockedStorage = (): SessionStorage => {
  return { getSession: sinon.spy(), commitSession: sinon.spy(), destroySession: sinon.spy() };
};
