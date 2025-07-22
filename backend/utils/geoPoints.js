// Transforms the coordinates of a GeoJSON Point into { lat, lon } format.

function transformCoordinates(coordinates) {
  if (Array.isArray(coordinates) && coordinates.length === 2) {
    return { lat: coordinates[1], lon: coordinates[0] };
  }
  return null;
}

function transformGeoJSONPoints(points) {
  return points.map((point) => transformCoordinates(point.coordinates));
}

module.exports = { transformGeoJSONPoints };
