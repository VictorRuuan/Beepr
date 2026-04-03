import { supabase } from '../supabase';

export const searchProducts = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('search-products', { body });

export const getProductsByCategory = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('get-products-by-category', { body });

export const getRecommendations = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('get-recommendations', { body });

export const processDailyRecommendations = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('process-daily-recommendations', { body });

export const scheduleDailyRecommendations = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('schedule-daily-recommendations', { body });

export const getBrandCatalog = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('get-brand-catalog', { body });

export const getBrandAnalytics = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('get-brand-analytics', { body });

export const listBrandProduct = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('list-brand-product', { body });

export const unlistBrandProduct = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('unlist-brand-product', { body });

export const trackInteraction = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('track-interaction', { body });
