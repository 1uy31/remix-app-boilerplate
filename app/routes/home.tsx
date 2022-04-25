import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { json, LinksFunction, LoaderFunction } from '@remix-run/node';

import stylesUrl from '~/styles/home.css';
import { AuthService, createAuthService } from '~/services/auth';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

type LoaderData = {
  username: string | undefined;
};

export const loader: LoaderFunction = async ({ request }, authService: AuthService = createAuthService()) => {
  const username = await authService.getUsernameByCookie(request.headers.get('Cookie'));
  const data: LoaderData = {
    username,
  };
  return json(data);
};

const HomeRoute = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <header className="home-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Boilerplate" aria-label="Remix Boilerplate">
              <span className="logo">🤪</span>
              <span className="logo-medium">HELL🤪</span>
            </Link>
          </h1>
          {data.username ? (
            <div className="user-info">
              <span>{`Hi ${data.username}`}</span>
              <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default HomeRoute;
