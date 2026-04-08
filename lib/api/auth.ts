import { createEdgeFunction } from './client';

export const authSignUp = createEdgeFunction('auth-signup');

export const authSignIn = createEdgeFunction('auth-signin');

export const authRefresh = createEdgeFunction('auth-refresh');

export const authSocial = createEdgeFunction('auth-social');

export const verifyAge = createEdgeFunction('verify-age');

export const deleteAccount = createEdgeFunction('delete-account');

export const deleteUserByEmail = createEdgeFunction('delete-user-by-email');
