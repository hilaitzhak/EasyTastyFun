/**
 * Maps an Axios error to a user-friendly i18n key.
 * Never exposes raw server messages to the user.
 */
export function getApiErrorKey(error: any): string {
  if (!error.response) {
    // Network / timeout — no response received
    return 'errors.network';
  }

  const status: number = error.response?.status;

  if (status === 400) return 'errors.badRequest';
  if (status === 401) return 'errors.unauthorized';
  if (status === 403) return 'errors.forbidden';
  if (status === 404) return 'errors.notFound';
  if (status === 413) return 'errors.fileTooLarge';
  if (status >= 500)  return 'errors.server';

  return 'errors.generic';
}
