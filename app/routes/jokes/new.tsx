import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { createJokeConnector, JokeConnector } from '~/database/jokeConnector';
import { Link, useActionData, useCatch } from '@remix-run/react';
import { z, ZodError } from 'zod';
import { getMessageFromZodIssues } from '~/utils';
import { AuthService, createAuthService } from '~/services/auth';

const newJokeInputsSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
    })
    .min(1, { message: 'Name is required' })
    .max(256, { message: 'Must be 256 or fewer characters long' }),
  content: z
    .string({
      invalid_type_error: 'Content must be a string',
    })
    .min(1, { message: 'Content is required' })
    .max(1000, { message: 'Must be 1000 or fewer characters long' }),
});

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name?: string;
    content?: string;
  };
};

export const loader: LoaderFunction = async ({ request }, authService: AuthService = createAuthService()) => {
  const username = await authService.getUsernameByCookie(request.headers.get('Cookie'));
  if (!username) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return json({});
};

export const action: ActionFunction = async ({ request }, jokeConnector: JokeConnector = createJokeConnector()) => {
  const form = await request.formData();
  const name = form.get('name');
  const content = form.get('content');
  try {
    const validatedData = newJokeInputsSchema.parse({ name, content });
    const joke = await jokeConnector.create(validatedData.name, validatedData.content);
    return redirect(`/jokes/${joke.id}`);
  } catch (err: any) {
    if (err instanceof ZodError) {
      const fieldErrors = {
        name: getMessageFromZodIssues(err.issues, 'name'),
        content: getMessageFromZodIssues(err.issues, 'content'),
      };
      return json({ fieldErrors }, { status: 400 });
    }
    return json({ formError: err.message }, { status: 400 });
  }
};

const NewJokeRoute = () => {
  const actionData = useActionData<ActionData>();
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <>
          <label>
            Name: <input type="text" name="name" />
          </label>
          {actionData?.fieldErrors?.name && (
            <p className="form-validation-error" role="alert" id="content-error">
              {actionData.fieldErrors.name}
            </p>
          )}
        </>

        <>
          <label>
            Content: <textarea name="content" />
          </label>
          {actionData?.fieldErrors?.content && (
            <p className="form-validation-error" role="alert" id="content-error">
              {actionData.fieldErrors.content}
            </p>
          )}
        </>

        <div>
          {actionData?.formError && (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          )}
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewJokeRoute;

export const CatchBoundary = () => {
  const caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }
};

export const ErrorBoundary = () => {
  return <div className="error-container">Something unexpected went wrong. Sorry about that.</div>;
};
