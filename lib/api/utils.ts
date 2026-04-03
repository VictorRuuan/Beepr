import { supabase } from '../supabase';

export const migratePotency = async (body?: Record<string, unknown>) =>
  supabase.functions.invoke('migrate-potency', { body });
