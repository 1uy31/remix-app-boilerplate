import sinon from 'sinon';
import { UserConnector } from '~/database/userConnector';

export const createMockedUserConnector = (): UserConnector => {
  return {
    create: sinon.spy(),
    getByUsername: sinon.spy(),
  };
};
