import { supabase } from '../supabase';

export const sendPushNotification = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('send-push-notification', { body });

export const notifyProductMatch = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('notify-product-match', { body });

export const notifyNewProduct = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('notify-new-product', { body });

export const notifyOrderUpdate = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('notify-order-update', { body });

export const notifyDealAlert = async (body: Record<string, unknown>) =>
  supabase.functions.invoke('notify-deal-alert', { body });

export const processNotificationQueue = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('process-notification-queue', { body });

export const processNewProductQueue = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('process-new-product-queue', { body });

export const processDealAlertQueue = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('process-deal-alert-queue', { body });
