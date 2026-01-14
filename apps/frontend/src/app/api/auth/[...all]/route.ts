import { toNextJsHandler } from 'better-auth/next-js';
// TODO: This was importing from '@lib/auth' which does not exist.
// It has been changed to import from the common package.
// Also, the baseURL in the auth config (packages/common/src/auth.config.ts)
// seems to be misconfigured. It should point to the backend URL (e.g., http://localhost:3001)
// not the frontend URL (http://localhost:3000).
import { auth } from '@we-got-jobz/common/src/auth.config';

const handler = toNextJsHandler(auth);

export const { GET, POST, PUT, DELETE } = handler;
