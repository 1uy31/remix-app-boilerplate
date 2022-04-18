import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { json, LoaderFunction } from '@remix-run/node';
import { createJokeConnector } from '~/database/joke.connector';

type LoaderData = {
  jokeListItems: Array<{ id: string; name: string }>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    jokeListItems: await createJokeConnector().getAll(),
  };
  return json(data);
};

const JokesRoute = () => {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <h1>J🤪KES</h1>
      <main>
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokeListItems.map((joke) => (
                <li key={joke.id}>
                  <Link to={joke.id}>{joke.name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default JokesRoute;
