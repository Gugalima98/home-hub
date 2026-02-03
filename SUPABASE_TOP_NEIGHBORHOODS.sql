CREATE OR REPLACE FUNCTION get_top_neighborhoods(
  target_city TEXT DEFAULT NULL,
  target_operation TEXT DEFAULT NULL
) 
RETURNS TABLE (
  neighborhood TEXT,
  count BIGINT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.neighborhood,
    COUNT(*) as count
  FROM properties p
  WHERE 
    p.status = 'active' AND
    (target_city IS NULL OR p.city ILIKE '%' || target_city || '%') AND
    (target_operation IS NULL OR p.operation_type = target_operation)
  GROUP BY p.neighborhood
  ORDER BY count DESC
  LIMIT 5;
END;
$$;
