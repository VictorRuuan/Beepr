import { createEdgeFunction } from './client';

export const getFavorites = createEdgeFunction('get-favorites');

export const checkFavoriteStatus = createEdgeFunction('check-favorite-status');

export const toggleFavorite = createEdgeFunction('toggle-favorite');

export const updateFavoriteNotes = createEdgeFunction('update-favorite-notes');

export const checkBusinessFavoriteStatus = createEdgeFunction('check-business-favorite-status');

export const toggleBusinessFavorite = createEdgeFunction('toggle-business-favorite');
