/**
 * Get Nearby Businesses Edge Function
 * 
 * Returns businesses (dispensaries) within their operational radius from user's location
 * Supports both delivery and pickup service types
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BusinessResult {
  id: string
  business_name: string
  business_city: string
  business_state: string
  business_address: string
  business_latitude: number
  business_longitude: number
  business_phone: string | null
  business_logo_url: string | null
  hours_of_operation: any
  delivery_radius_miles: number | null
  pickup_radius_miles: number | null
  distance_miles: number
  retailer_type: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') || '' }
        }
      }
    )

    // Parse request body
    // Phase 2.5: Force pickup-only (delivery functionality removed)
    const { user_lat, user_lon, limit = 6 } = await req.json()
    const service_type = 'pickup' // Hardcoded for pickup-only model

    console.log('Get nearby businesses (pickup-only):', { user_lat, user_lon, limit })

    // Validate required parameters
    if (!user_lat || !user_lon) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: user_lat and user_lon are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // ── PostGIS-based spatial query ──────────────────────────────────────────
    // Calls the `nearby_businesses` PostgreSQL function (see migration
    // supabase/migrations/20260403000000_add_nearby_businesses_rpc.sql).
    // ST_DWithin runs entirely inside the DB — no Haversine JS loop, no
    // full-table fetch. Results come back already sorted by distance.
    const { data: businessesData, error: businessError } = await supabase
      .rpc('nearby_businesses', {
        p_lat: parseFloat(user_lat),
        p_lon: parseFloat(user_lon),
        p_limit: limit,
      });

    if (businessError) {
      console.error('Error fetching businesses:', businessError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch businesses',
          details: businessError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Fetched businesses via PostGIS:', (businessesData || []).length)

    // Results from the RPC are already filtered by pickup_radius and sorted by distance.
    // We only need to enrich with product counts and open/closed status.
    const businesses: any[] = businessesData || [];

    // Get product counts for each business
    const businessesWithCounts = await Promise.all(
      businesses.map(async (business) => {
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', business.id)
          .eq('is_active', true)

        if (error) {
          console.error(`Error getting product count for business ${business.id}:`, error)
        }

        // Check if currently open (using Pacific Time for California businesses)
        // Note: This assumes all businesses are in Pacific Time. For multi-timezone support,
        // business timezone would need to be stored in the database
        const now = new Date()
        const pacificTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
        const currentDay = pacificTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        const currentHour = pacificTime.getHours()
        const currentMinute = pacificTime.getMinutes()
        const currentTimeMinutes = currentHour * 60 + currentMinute
        
        let isOpen = false
        if (business.hours_of_operation && business.hours_of_operation[currentDay]) {
          const hours = business.hours_of_operation[currentDay]
          
          // Check if marked as closed
          if (hours.closed === true) {
            isOpen = false
          } else if (hours.open && hours.close) {
            // Convert time strings to minutes for comparison
            const [openHour, openMin] = hours.open.split(':').map(Number)
            const [closeHour, closeMin] = hours.close.split(':').map(Number)
            const openTimeMinutes = openHour * 60 + openMin
            const closeTimeMinutes = closeHour * 60 + closeMin
            
            isOpen = currentTimeMinutes >= openTimeMinutes && currentTimeMinutes <= closeTimeMinutes
          }
        }

        return {
          id: business.id,
          business_name: business.business_name,
          business_city: business.business_city,
          business_state: business.business_state,
          business_address: business.business_address,
          business_phone: business.business_phone,
          business_logo_url: business.business_logo_url,
          distance_miles: Math.round(business.distance_miles * 10) / 10, // Round to 1 decimal
          service_types: business.service_types,
          product_count: count || 0,
          is_open: isOpen,
          retailer_type: business.retailer_type,
          hours_of_operation: business.hours_of_operation
        }
      })
    )

    console.log(`Found ${businessesWithCounts.length} nearby businesses`)

    return new Response(
      JSON.stringify({
        businesses: businessesWithCounts,
        total: businessesWithCounts.length,
        user_location: { latitude: user_lat, longitude: user_lon }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in get-nearby-businesses:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
