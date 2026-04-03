import { supabase } from '../supabase';

export const submitReview = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('submit-review', { body });

export const getProductReviews = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('get-product-reviews', { body });

export const getMyReviews = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('get-my-reviews', { body });

export const deleteReview = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('delete-review', { body });

export const markReviewHelpful = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('mark-review-helpful', { body });
