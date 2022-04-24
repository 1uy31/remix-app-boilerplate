import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { redirectWithClearedSession } from '~/utils';

export const action: ActionFunction = async ({ request }) => {
  return redirectWithClearedSession(request, '/login');
};

export const loader: LoaderFunction = async () => {
  return redirect('/');
};
