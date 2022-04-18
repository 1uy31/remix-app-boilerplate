import { ActionFunction, json, redirect } from '@remix-run/node';
import { createJokeConnector, JokeConnector } from '~/database/joke.connector';
import { useActionData } from '@remix-run/react';
import { z, ZodError } from 'zod';

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
        name: err.issues.map((issue) => (issue.path.includes('name') ? issue.message : undefined)),
        content: err.issues.map((issue) => (issue.path.includes('content') ? issue.message : undefined)),
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
