import { Joke } from '~/domain.model';
import { json, LoaderFunction } from '@remix-run/node';
import { createJokeConnector } from '~/database/joke.connector';
import { throwIfUndefined } from '~/utils';
import { Link, useLoaderData } from '@remix-run/react';

type LoaderData = Joke;

export const loader: LoaderFunction = async ({ params }) => {
  const joke = params.jokeId ? await createJokeConnector().getById(params.jokeId) : undefined;
  const data: LoaderData = throwIfUndefined(joke, 'Joke not found');
  return json(data);
};

const DetailJokeRoute = () => {
  const joke = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  );
};

export default DetailJokeRoute;
