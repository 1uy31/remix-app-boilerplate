import { Joke } from '~/domainModel';
import { json, LoaderFunction } from '@remix-run/node';
import { createJokeConnector, JokeConnector } from '~/database/jokeConnector';
import { throwIfUndefined } from '~/utils';
import { Link, useCatch, useLoaderData, useParams } from '@remix-run/react';

type LoaderData = {
  joke: Joke;
};

export const loader: LoaderFunction = async ({ params }, jokeConnector: JokeConnector = createJokeConnector()) => {
  const joke = params.jokeId ? await jokeConnector.getById(params.jokeId) : undefined;
  if (!joke) {
    throw new Response('What a joke! Not found.', {
      status: 404,
    });
  }
  return json({ joke });
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

export const CatchBoundary = () => {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return <div className="error-container">Huh? What the heck is "{params.jokeId}"?</div>;
  }
  throw new Error(`Unhandled error: ${caught.status}`);
};

export const ErrorBoundary = () => {
  const { jokeId } = useParams();
  return <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>;
};
