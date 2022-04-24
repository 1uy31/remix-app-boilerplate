import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { redirectWithClearedSession } from '~/utils';

/**
 * Using an action (rather than a loader) to avoid CSRF problems by using a POST request rather than a GET request.
 * This is why the logout button is a form and not a link.
 * Additionally, Remix will only re-call loaders when perform an action,
 * so if a loader is used then the cache would not get invalidated.
 */
export const action: ActionFunction = async ({ request }) => {
  return redirectWithClearedSession(request, '/login');
};

/**
 * The loader is here just in case someone somehow lands on that page, we'll just redirect them back home.
 */
export const loader: LoaderFunction = async () => {
  return redirect('/');
};
