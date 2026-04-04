import { createEdgeFunction } from './client';

export const getNearbyBusinesses = createEdgeFunction('get-nearby-businesses');

export const productsNearby = createEdgeFunction('products-nearby');

export const productsNearbySimple = createEdgeFunction('products-nearby-simple');

export const geocodeSearch = createEdgeFunction('geocode-search');

export const getMapboxToken = createEdgeFunction('get-mapbox-token');

export const verifyLocation = createEdgeFunction('verify-location');

export const getJurisdictionTax = createEdgeFunction('get-jurisdiction-tax');
