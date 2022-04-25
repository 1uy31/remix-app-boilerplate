import { ActionFunction, LinksFunction, redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, Link, useSearchParams } from '@remix-run/react';
import { z, ZodError } from 'zod';
import { createAuthService } from '~/services/auth';
import { redirectWithAttachedSession } from '~/sessionUtils';
import stylesUrl from '~/styles/login.css';
import { getMessageFromZodIssues } from '~/utils';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

enum FormType {
  Login = 'LOGIN',
  Register = 'REGISTER',
}

const formTypeHandlerMapper = {
  [FormType.Login]: createAuthService().login,
  [FormType.Register]: createAuthService().register,
};

const userInputSchema = z.object({
  formType: z.nativeEnum(FormType),
  username: z
    .string({
      invalid_type_error: 'Username must be a string',
    })
    .min(1, { message: 'Username is required' })
    .max(512, { message: 'Must be 512 or fewer characters long' }),
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
    })
    .min(11, { message: 'Must be more than 11 characters long' })
    .max(256, { message: 'Must be 256 or fewer characters long' }),
  redirectUrl: z
    .string({
      invalid_type_error: 'Redirect url must be a string',
    })
    .max(256, { message: 'Must be 256 or fewer characters long' }),
});

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username?: string;
    password?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const URLS = ['/home', '/'];
  const DEFAULT_REDIRECT_TO = '/home';
  const form = await request.formData();
  const formType = form.get('formType');
  const username = form.get('username');
  const password = form.get('password');
  const redirectUrl = form.get('redirectTo') || DEFAULT_REDIRECT_TO;

  try {
    const validatedData = userInputSchema.parse({ formType, username, password, redirectUrl });
    const redirectTo = URLS.includes(validatedData.redirectUrl) ? validatedData.redirectUrl : DEFAULT_REDIRECT_TO;

    const authServiceHandler = formTypeHandlerMapper[validatedData.formType];
    if (!authServiceHandler) return json({ formError: 'Invalid form action!' }, { status: 400 });
    const retrievedUsername = await authServiceHandler(validatedData.username, validatedData.password);
    return await redirectWithAttachedSession(retrievedUsername, redirectTo);
  } catch (err: any) {
    console.error('routes/login.action', err);

    if (!(err instanceof ZodError)) {
      return json({ formError: err.message }, { status: 400 });
    }

    const fieldErrors = {
      username: getMessageFromZodIssues(err.issues, 'username'),
      password: getMessageFromZodIssues(err.issues, 'password'),
    };
    const formError =
      getMessageFromZodIssues(err.issues, 'formType') || getMessageFromZodIssues(err.issues, 'redirectUrl');

    return json({ fieldErrors, formError }, { status: 400 });
  }
};

const LoginRoute = () => {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1>Login</h1>
        <form method="post">
          <input type="hidden" name="redirectTo" value={searchParams.get('redirectTo') ?? undefined} />
          <fieldset>
            <legend className="sr-only">Login or Register?</legend>
            <label>
              <input type="radio" name="formType" value="LOGIN" /> Login
            </label>
            <label>
              <input type="radio" name="formType" value="REGISTER" /> Register
            </label>
          </fieldset>
          <div>
            <label htmlFor="username-input">Username</label>
            <input type="text" id="username-input" name="username" />
            {actionData?.fieldErrors?.username && (
              <p className="form-validation-error" role="alert" id="username-error">
                {actionData.fieldErrors.username}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input id="password-input" name="password" type="password" />
            {actionData?.fieldErrors?.password && (
              <p className="form-validation-error" role="alert" id="password-error">
                {actionData.fieldErrors.password}
              </p>
            )}
          </div>
          <div id="form-error-message">
            {actionData?.formError && (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            )}
          </div>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div className="links">
        <ul>
          <li>
            <Link to="/">Hello</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoginRoute;
