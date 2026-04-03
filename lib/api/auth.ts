import { supabase } from '../supabase';

export const authSignUp = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('auth-signup', { body });

export const authSignIn = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('auth-signin', { body });

export const authRefresh = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('auth-refresh', { body });

export const authSocial = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('auth-social', { body });

export const verifyAge = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('verify-age', { body });

export const deleteAccount = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('delete-account', { body });

export const deleteUserByEmail = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('delete-user-by-email', { body });
