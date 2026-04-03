import { supabase } from '../supabase';

export const processOrder = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('process-order', { body });

export const manageCart = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('manage-cart', { body });

export const sendOrderConfirmation = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('send-order-confirmation', { body });

export const sendOrderCompleted = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('send-order-completed', { body });
