import { createEdgeFunction } from './client';

export const searchProducts = createEdgeFunction('search-products');

export const getProductsByCategory = createEdgeFunction('get-products-by-category');

export const getRecommendations = createEdgeFunction('get-recommendations');

export const processDailyRecommendations = createEdgeFunction('process-daily-recommendations');

export const scheduleDailyRecommendations = createEdgeFunction('schedule-daily-recommendations');

export const getBrandCatalog = createEdgeFunction('get-brand-catalog');

export const getBrandAnalytics = createEdgeFunction('get-brand-analytics');

export const listBrandProduct = createEdgeFunction('list-brand-product');

export const unlistBrandProduct = createEdgeFunction('unlist-brand-product');

export const trackInteraction = createEdgeFunction('track-interaction');
