import { supabase } from '../supabase';

export const getProfile = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('get-profile', { body });

export const updateProfile = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('update-profile', { body });

export const updatePreferences = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('update-preferences', { body });
