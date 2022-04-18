import { Joke } from '~/domain.model';
import { json, LoaderFunction } from '@remix-run/node';
import { createJokeConnector, JokeConnector } from '~/database/joke.connector';
import { Link, useLoaderData } from '@remix-run/react';

type LoaderData = {
  joke: Joke;
};

export const loader: LoaderFunction = async ({}, jokeConnector: JokeConnector = createJokeConnector()) => {
  const count = await jokeConnector.getCount();
  const randomSkipNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await jokeConnector.getList(1, randomSkipNumber);
  return json({ joke: randomJoke });
};

const JokesIndexRoute = () => {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.joke.content}</p>
      <Link to={data.joke.id}>"{data.joke.name}" Permalink</Link>
    </div>
  );
};

export default JokesIndexRoute;
