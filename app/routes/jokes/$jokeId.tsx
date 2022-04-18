import { Joke } from '~/domain.model';
import { json, LoaderFunction } from '@remix-run/node';
import { createJokeConnector, JokeConnector } from '~/database/joke.connector';
import { throwIfUndefined } from '~/utils';
import { Link, useLoaderData } from '@remix-run/react';

type LoaderData = {
    joke: Joke
};

export const loader: LoaderFunction = async ({ params }, jokeConnector: JokeConnector = createJokeConnector()) => {
  const jokeById = params.jokeId ? await jokeConnector.getById(params.jokeId) : undefined;
  return json({joke: throwIfUndefined(jokeById, 'Joke not found')});
};

const DetailJokeRoute = () => {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
    </div>
  );
};

export default DetailJokeRoute;
