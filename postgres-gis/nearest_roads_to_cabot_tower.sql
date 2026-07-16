-- Cabot Tower: latitude 51.45416091207888, longitude -2.6067972522561678
-- One result per named road. Its constituent OSM line segments are collected
-- into one MultiLineString so pgAdmin can render it on the map.
WITH named_roads AS (
  SELECT r.name,
         ARRAY_AGG(DISTINCT r.highway) AS highways,
         ST_CollectionExtract(ST_Collect(r.way), 2) AS geometry
    FROM osm.planet_osm_roads AS r
   WHERE NULLIF(r.name, '') IS NOT NULL
   GROUP BY r.name
),
tower AS (
  SELECT ST_SetSRID(
           ST_MakePoint(-2.6067972522561678, 51.45416091207888),
           4326
         ) AS location
)
SELECT nr.name,
       nr.highways,
       ROUND(
         ST_Distance(nr.geometry::geography, tower.location::geography)::numeric,
         2
       ) AS distance_metres,
       nr.geometry
  FROM named_roads AS nr
 CROSS JOIN tower
 ORDER BY ST_Distance(nr.geometry::geography, tower.location::geography), nr.name
 LIMIT 10;
