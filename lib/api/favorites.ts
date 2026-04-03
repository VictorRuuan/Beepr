import { supabase } from '../supabase';

export const getFavorites = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('get-favorites', { body });

export const checkFavoriteStatus = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('check-favorite-status', { body });

export const toggleFavorite = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('toggle-favorite', { body });

export const updateFavoriteNotes = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('update-favorite-notes', { body });

export const checkBusinessFavoriteStatus = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('check-business-favorite-status', { body });

export const toggleBusinessFavorite = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('toggle-business-favorite', { body });
