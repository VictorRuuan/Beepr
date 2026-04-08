import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return fallback;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    );

    const { limit = 10 } = await req.json().catch(() => ({}));
    const parsedLimit = Number.isFinite(Number(limit)) ? Math.min(Math.max(Number(limit), 1), 30) : 10;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { data: recommendations, error: recommendationsError } = await supabase.rpc(
      'match_products_for_user',
      {
        p_user_id: user.id,
        p_limit: parsedLimit,
      },
    );

    if (recommendationsError) {
      const message = getErrorMessage(
        recommendationsError,
        'Failed to fetch recommendations.',
      );
      const missingRpc =
        message.includes('match_products_for_user') && message.toLowerCase().includes('does not exist');

      return new Response(
        JSON.stringify({
          error: missingRpc
            ? 'Recommendation RPC is not available yet. Apply the migration 20260404103000_create_match_products_for_user_rpc.sql in the Supabase SQL Editor.'
            : message,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({
        recommendations: recommendations ?? [],
        total: recommendations?.length ?? 0,
      }),
      {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: getErrorMessage(error, 'Unexpected error') }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
