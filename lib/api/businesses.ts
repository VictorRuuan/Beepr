import { supabase } from '../supabase';

export const getNearbyBusinesses = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('get-nearby-businesses', { body });

export const productsNearby = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('products-nearby', { body });

export const productsNearbySimple = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('products-nearby-simple', { body });

export const geocodeSearch = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('geocode-search', { body });

export const getMapboxToken = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('get-mapbox-token', { body });

export const verifyLocation = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('verify-location', { body });

export const getJurisdictionTax = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('get-jurisdiction-tax', { body });
