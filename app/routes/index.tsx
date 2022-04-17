import stylesUrl from '../styles/index.css';
import { LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

const IndexRoute = () => {
  return <div>Hello Index Route</div>;
};

export default IndexRoute;
