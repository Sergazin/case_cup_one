
export function get_center_of_coords(points: [number, number][]): [number, number] {
  if (points.length === 0) {
    throw new Error("No points provided");
  }

  let sumLat = 0;
  let sumLng = 0;

  points.forEach(([lat, lng]) => {
    sumLat += lat;
    sumLng += lng;
  });

  const centerLat = sumLat / points.length;
  const centerLng = sumLng / points.length;

  return [centerLat, centerLng];
}

type LatLng = [number, number];

export function calculate_center_and_zoom(
  points: LatLng[],
  mapWidth: number,
  mapHeight: number,
): { center: LatLng; zoom: number } {
  if (points.length === 0) {
    throw new Error("No points provided");
  }

  // Calculate bounds (min and max lat/lng)
  let minLat = points[0][0],
    maxLat = points[0][0],
    minLng = points[0][1],
    maxLng = points[0][1];

  points.forEach(([lat, lng]) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  // Calculate center of the bounds
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  // Calculate the latitude and longitude deltas
  //const _latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;

  // Constants for converting degrees to pixels for zoom level calculation
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  function latRad(lat: number): number {
    const sin = Math.sin((lat * Math.PI) / 180);
    return Math.log((1 + sin) / (1 - sin)) / 2;
  }

  function zoom(mapPx: number, worldPx: number, fraction: number): number {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

  // Find the appropriate zoom level
  const latFraction = (latRad(maxLat) - latRad(minLat)) / Math.PI;
  const lngFraction = lngDiff / 360;
  const latZoom = zoom(mapHeight, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(mapWidth, WORLD_DIM.width, lngFraction);

  // Return the center and the minimum zoom level that fits all points
  return {
    center: [centerLat, centerLng],
    zoom: Math.min(latZoom, lngZoom, ZOOM_MAX),
  };
}

// Example usage:
/*
const _points: LatLng[] = [
  [40.7128, -74.006], // New York
  [34.0522, -118.2437], // Los Angeles
  [51.5074, -0.1278], // London
];
* **/

// Assuming a map width of 800px and height of 600px
