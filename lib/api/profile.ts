import { createEdgeFunction } from './client';

export const getProfile = createEdgeFunction('get-profile');

export const updateProfile = createEdgeFunction('update-profile');

export const updatePreferences = createEdgeFunction('update-preferences');
