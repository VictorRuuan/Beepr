-- Migration: add_nearby_businesses_rpc
-- Replaces the Haversine JavaScript loop in the get-nearby-businesses Edge Function
-- with a server-side PostGIS query. All distance filtering and sorting happen
-- inside PostgreSQL — no full-table fetch, no client-side computation.

-- Requires: PostGIS extension (already enabled on Supabase projects by default)
-- Requires: business_applications table with business_latitude / business_longitude columns

-- ─── Enable PostGIS (idempotent) ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS postgis;

-- ─── Add geography column (computed from existing lat/lon) ───────────────────
-- We store it as a generated column so it stays in sync automatically.
ALTER TABLE business_applications
  ADD COLUMN IF NOT EXISTS location geography(Point, 4326);

-- Back-fill existing rows
UPDATE business_applications
SET location = ST_SetSRID(
  ST_MakePoint(business_longitude, business_latitude),
  4326
)::geography
WHERE business_latitude IS NOT NULL
  AND business_longitude IS NOT NULL
  AND location IS NULL;

-- Keep the column in sync on insert / update via a trigger
CREATE OR REPLACE FUNCTION sync_business_location()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.business_latitude IS NOT NULL AND NEW.business_longitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(
      ST_MakePoint(NEW.business_longitude, NEW.business_latitude),
      4326
    )::geography;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_business_location ON business_applications;
CREATE TRIGGER trg_sync_business_location
  BEFORE INSERT OR UPDATE OF business_latitude, business_longitude
  ON business_applications
  FOR EACH ROW EXECUTE FUNCTION sync_business_location();

-- ─── Spatial index ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_business_applications_location
  ON business_applications USING GIST (location);

-- ─── RPC: nearby_businesses ───────────────────────────────────────────────────
-- Returns businesses within their own pickup_radius_miles of the given point,
-- ordered by distance (closest first), limited to p_limit rows.
--
-- Called by the Edge Function via:
--   supabase.rpc('nearby_businesses', { p_lat, p_lon, p_limit })
CREATE OR REPLACE FUNCTION nearby_businesses(
  p_lat   double precision,
  p_lon   double precision,
  p_limit integer DEFAULT 6
)
RETURNS TABLE (
  id                    uuid,
  business_name         text,
  business_city         text,
  business_state        text,
  business_address      text,
  business_phone        text,
  business_logo_url     text,
  hours_of_operation    jsonb,
  pickup_radius_miles   numeric,
  retailer_type         text,
  distance_miles        double precision
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    ba.id,
    ba.business_name,
    ba.business_city,
    ba.business_state,
    ba.business_address,
    ba.business_phone,
    ba.business_logo_url,
    ba.hours_of_operation,
    ba.pickup_radius_miles,
    ba.retailer_type,
    -- ST_Distance returns metres; convert to miles
    ST_Distance(
      ba.location,
      ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography
    ) / 1609.344  AS distance_miles
  FROM business_applications ba
  WHERE
    ba.status = 'approved'
    AND ba.service_area_enabled = true
    AND ba.location IS NOT NULL
    -- ST_DWithin uses the spatial index — fast even with thousands of rows
    AND ST_DWithin(
      ba.location,
      ST_SetSRID(ST_MakePoint(p_lon, p_lat), 4326)::geography,
      -- Convert pickup_radius_miles → metres (default 50 mi if null)
      COALESCE(ba.pickup_radius_miles, 50) * 1609.344
    )
  ORDER BY distance_miles
  LIMIT p_limit;
$$;

-- Grant execution to the anon and authenticated roles (called via Edge Function)
GRANT EXECUTE ON FUNCTION nearby_businesses(double precision, double precision, integer)
  TO anon, authenticated;
