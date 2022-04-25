import stylesUrl from '~/styles/index.css';
import { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

const Index = () => {
  return (
    <div className="container">
      <div className="content">
        <h1>
          <span>Hello!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="login">Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Index;
