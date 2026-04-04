import { createEdgeFunction } from './client';

export const submitReview = createEdgeFunction('submit-review');

export const getProductReviews = createEdgeFunction('get-product-reviews');

export const getMyReviews = createEdgeFunction('get-my-reviews');

export const deleteReview = createEdgeFunction('delete-review');

export const markReviewHelpful = createEdgeFunction('mark-review-helpful');
