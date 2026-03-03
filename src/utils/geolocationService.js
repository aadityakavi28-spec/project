// ============================================================
// GEOLOCATION SERVICE
// Uses OpenStreetMap Nominatim API for geocoding
// ============================================================

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

/**
 * Geocode a location string to coordinates
 * @param {string} location - Location name/address
 * @returns {Promise<{lat: number, lon: number, displayName: string}>}
 */
export const geocodeLocation = async (location) => {
  try {
    const params = new URLSearchParams({
      q: location,
      format: 'json',
      limit: '1',
    });

    const response = await fetch(`${NOMINATIM_API}?${params}`, {
      headers: {
        'User-Agent': 'StructuraX/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

/**
 * Get metadata about a location using OSM
 * @param {number} lat - Latitude
 * @param @param {number} lon - Longitude
 * @param {string} assetType - Asset type (bridge, building, tunnel)
 * @returns {Promise<Object>}
 */
export const getLocationMetadata = async (lat, lon, assetType) => {
  try {
    // Get nearby features from OSM
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"](around:500,${lat},${lon});
        way["building"](around:500,${lat},${lon});
        way["highway"](around:500,${lat},${lon});
        way["water"](around:500,${lat},${lon});
        relation["water"](around:500,${lat},${lon});
      );
      out body;
    `;

    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    
    try {
      const response = await fetch(overpassUrl, {
        method: 'POST',
        body: overpassQuery,
      });

      if (!response.ok) {
        throw new Error('Overpass query failed');
      }

      const data = await response.json();
      
      // Analyze results
      const features = data.elements || [];
      
      const metadata = {
        nearbyBuildings: features.filter(f => f.tags?.building).length,
        nearbyRoads: features.filter(f => f.tags?.highway).length,
        nearWater: features.filter(f => f.tags?.water || f.tags?.waterway).length,
        urbanDensity: features.filter(f => f.tags?.amenity).length,
      };

      // Determine asset characteristics based on location
      return {
        ...metadata,
        suggestedFootprint: estimateFootprint(metadata, assetType),
        suggestedSpanCount: assetType === 'bridge' ? estimateBridgeSpan(metadata) : null,
      };
    } catch (overpassError) {
      console.warn('Overpass API failed, using fallback:', overpassError);
      return getDefaultMetadata(assetType);
    }
  } catch (error) {
    console.error('Location metadata error:', error);
    return getDefaultMetadata(assetType);
  }
};

/**
 * Estimate footprint size based on location metadata
 */
const estimateFootprint = (metadata, assetType) => {
  if (metadata.nearWater && assetType === 'bridge') {
    // Bridges near water typically have longer spans
    return { width: 15, depth: 80, length: 200 };
  }
  
  if (metadata.urbanDensity > 10) {
    // High density urban area - larger buildings
    return { width: 25, depth: 25, floors: 15 };
  }
  
  if (metadata.urbanDensity > 5) {
    return { width: 20, depth: 20, floors: 10 };
  }
  
  // Default suburban
  return { width: 15, depth: 15, floors: 5 };
};

/**
 * Estimate bridge span count based on location
 */
const estimateBridgeSpan = (metadata) => {
  if (metadata.nearWater) {
    // Near water - likely longer bridge
    return 3;
  }
  return 2;
};

/**
 * Get default metadata when API fails
 */
export const getDefaultMetadata = (assetType) => {
  switch (assetType) {
    case 'bridge':
      return {
        nearbyBuildings: 0,
        nearbyRoads: 2,
        nearWater: true,
        urbanDensity: 1,
        suggestedFootprint: { width: 12, depth: 60, length: 150 },
        suggestedSpanCount: 2,
      };
    case 'building':
      return {
        nearbyBuildings: 5,
        nearbyRoads: 3,
        nearWater: false,
        urbanDensity: 5,
        suggestedFootprint: { width: 20, depth: 20, floors: 8 },
      };
    case 'tunnel':
      return {
        nearbyBuildings: 2,
        nearbyRoads: 2,
        nearWater: false,
        urbanDensity: 3,
        suggestedFootprint: { diameter: 8, segmentCount: 20, length: 500 },
      };
    default:
      return {};
  }
};

/**
 * Complete geolocation processing
 * @param {string} location - Location string
 * @param {string} assetType - Asset type
 * @returns {Promise<Object>}
 */
export const processLocation = async (location, assetType) => {
  // Step 1: Geocode
  const geoResult = await geocodeLocation(location);
  
  if (!geoResult) {
    return {
      success: false,
      error: 'Location not found. Using default values.',
      metadata: getDefaultMetadata(assetType),
    };
  }

  // Step 2: Get metadata
  const metadata = await getLocationMetadata(geoResult.lat, geoResult.lon, assetType);

  return {
    success: true,
    coordinates: {
      lat: geoResult.lat,
      lon: geoResult.lon,
    },
    displayName: geoResult.displayName,
    metadata,
  };
};

export default {
  geocodeLocation,
  getLocationMetadata,
  processLocation,
  getDefaultMetadata,
};

