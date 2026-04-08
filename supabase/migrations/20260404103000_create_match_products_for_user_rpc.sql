-- Migration: create_match_products_for_user_rpc
-- Adds a recommendation RPC so product matching runs inside PostgreSQL instead of
-- an Edge Function loop. Keep this migration additive and apply it manually in the
-- Supabase SQL Editor for the shared production database.
--
-- Security note:
-- This function is designed for authenticated app calls. Even though it accepts
-- p_user_id, it only returns rows when p_user_id matches auth.uid().

CREATE OR REPLACE FUNCTION match_products_for_user(
  p_user_id uuid,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  product_id uuid,
  business_id uuid,
  business_name text,
  name text,
  image_url text,
  price numeric,
  discount_price numeric,
  product_category text,
  product_format text,
  strain_name text,
  strain_type text,
  potency_category text,
  primary_effects text[],
  flavor_profile text[],
  average_rating numeric,
  review_count integer,
  favorite_count integer,
  popularity_score numeric,
  match_score numeric,
  matched_effects text[],
  matched_flavors text[],
  matched_strains text[],
  matched_formats text[],
  matched_potencies text[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH prefs AS (
    SELECT
      up.user_id,
      COALESCE(up.desired_effects, ARRAY[]::text[]) AS desired_effects,
      COALESCE(up.flavor_preferences, ARRAY[]::text[]) AS flavor_preferences,
      COALESCE(up.favorite_strains, ARRAY[]::text[]) AS favorite_strains,
      COALESCE(up.preferred_methods, ARRAY[]::text[]) AS preferred_methods,
      COALESCE(up.potency_preference, ARRAY[]::text[]) AS potency_preference,
      up.experience_level
    FROM user_preferences up
    WHERE up.user_id = p_user_id
      AND auth.uid() = p_user_id
  ),
  base AS (
    SELECT
      p.id AS product_id,
      p.business_id,
      ba.business_name,
      p.name,
      p.image_url,
      p.price,
      p.discount_price,
      p.product_category,
      p.product_format,
      p.strain_name,
      p.strain_type,
      p.potency_category,
      p.primary_effects,
      p.flavor_profile,
      p.average_rating,
      COALESCE(p.review_count, 0) AS review_count,
      COALESCE(p.favorite_count, 0) AS favorite_count,
      COALESCE(p.popularity_score, 0) AS popularity_score,
      COALESCE((
        SELECT ARRAY(
          SELECT UNNEST(pref.desired_effects)
          INTERSECT
          SELECT UNNEST(COALESCE(p.primary_effects, ARRAY[]::text[]) || COALESCE(p.secondary_effects, ARRAY[]::text[]))
        )
      ), ARRAY[]::text[]) AS matched_effects,
      COALESCE((
        SELECT ARRAY(
          SELECT UNNEST(pref.flavor_preferences)
          INTERSECT
          SELECT UNNEST(COALESCE(p.flavor_profile, ARRAY[]::text[]))
        )
      ), ARRAY[]::text[]) AS matched_flavors,
      COALESCE((
        SELECT ARRAY(
          SELECT UNNEST(pref.favorite_strains)
          INTERSECT
          SELECT UNNEST(
            CASE
              WHEN p.strain_name IS NULL THEN ARRAY[]::text[]
              ELSE ARRAY[p.strain_name]
            END
          )
        )
      ), ARRAY[]::text[]) AS matched_strains,
      COALESCE((
        SELECT ARRAY(
          SELECT UNNEST(pref.preferred_methods)
          INTERSECT
          SELECT UNNEST(
            CASE
              WHEN p.product_format IS NULL THEN ARRAY[]::text[]
              ELSE ARRAY[p.product_format]
            END
          )
        )
      ), ARRAY[]::text[]) AS matched_formats,
      COALESCE((
        SELECT ARRAY(
          SELECT UNNEST(pref.potency_preference)
          INTERSECT
          SELECT UNNEST(
            CASE
              WHEN p.potency_category IS NULL THEN ARRAY[]::text[]
              ELSE ARRAY[p.potency_category]
            END
          )
        )
      ), ARRAY[]::text[]) AS matched_potencies,
      pref.experience_level,
      COALESCE(p.recommended_experience_level, ARRAY[]::text[]) AS recommended_experience_level
    FROM products p
    JOIN business_applications ba
      ON ba.id = p.business_id
     AND ba.status = 'approved'
    LEFT JOIN prefs pref
      ON pref.user_id = p_user_id
    WHERE
      auth.uid() = p_user_id
      AND
      p.is_active = true
      AND COALESCE(p.stock_quantity, 0) > 0
  )
  SELECT
    product_id,
    business_id,
    business_name,
    name,
    image_url,
    price,
    discount_price,
    product_category,
    product_format,
    strain_name,
    strain_type,
    potency_category,
    primary_effects,
    flavor_profile,
    average_rating,
    review_count,
    favorite_count,
    popularity_score,
    (
      CARDINALITY(matched_effects) * 4
      + CARDINALITY(matched_flavors) * 3
      + CARDINALITY(matched_strains) * 3
      + CARDINALITY(matched_formats) * 2
      + CARDINALITY(matched_potencies) * 2
      + CASE
          WHEN experience_level IS NOT NULL
            AND experience_level = ANY(recommended_experience_level)
          THEN 4
          ELSE 0
        END
      + LEAST(COALESCE(popularity_score, 0) / 25.0, 2)
    )::numeric AS match_score,
    matched_effects,
    matched_flavors,
    matched_strains,
    matched_formats,
    matched_potencies
  FROM base
  ORDER BY
    match_score DESC,
    popularity_score DESC,
    average_rating DESC NULLS LAST,
    review_count DESC,
    favorite_count DESC,
    name ASC
  LIMIT GREATEST(COALESCE(p_limit, 10), 1);
$$;

GRANT EXECUTE ON FUNCTION match_products_for_user(uuid, integer)
  TO anon, authenticated;
