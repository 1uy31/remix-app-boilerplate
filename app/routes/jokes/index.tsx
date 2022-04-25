import { Joke } from '~/domainModel';
import { json, LoaderFunction } from '@remix-run/node';
import { createJokeConnector, JokeConnector } from '~/database/jokeConnector';
import { Link, useCatch, useLoaderData } from '@remix-run/react';

type LoaderData = {
  joke: Joke;
};

export const loader: LoaderFunction = async ({}, jokeConnector: JokeConnector = createJokeConnector()) => {
  const count = await jokeConnector.getCount();
  const randomSkipNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await jokeConnector.getList(1, randomSkipNumber);
  if (!randomJoke) {
    throw new Response('No random joke found', {
      status: 404,
    });
  }
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

export const CatchBoundary = () => {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div className="error-container">There are no jokes to display.</div>;
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
};

export const ErrorBoundary = () => {
  return <div className="error-container">I did a whoopsies.</div>;
};
