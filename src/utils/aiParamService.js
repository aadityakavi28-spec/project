// ============================================================
// AI PARAMETER SERVICE
// Generates structural parameters based on asset info and location
// In production, this would call an LLM API
// ============================================================

/**
 * Generate AI-suggested structural parameters
 * This simulates an LLM response with rule-based suggestions
 * 
 * @param {string} assetName - Name of the asset
 * @param {string} assetType - Type: bridge, building, tunnel
 * @param {Object} locationMetadata - Metadata from geolocation service
 * @returns {Promise<Object>} Structured parameters
 */
export const generateStructuralParams = async (assetName, assetType, locationMetadata) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  try {
    switch (assetType) {
      case 'building':
        return generateBuildingParams(assetName, locationMetadata);
      case 'bridge':
        return generateBridgeParams(assetName, locationMetadata);
      case 'tunnel':
        return generateTunnelParams(assetName, locationMetadata);
      default:
        throw new Error('Invalid asset type');
    }
  } catch (error) {
    console.error('AI parameter generation error:', error);
    return getDefaultParams(assetType);
  }
};

/**
 * Generate building parameters
 */
const generateBuildingParams = (assetName, locationMetadata) => {
  const { suggestedFootprint, urbanDensity, nearbyBuildings } = locationMetadata;
  
  // Analyze name for hints
  const nameLower = assetName.toLowerCase();
  const isTower = nameLower.includes('tower') || nameLower.includes('skyscraper');
  const isIndustrial = nameLower.includes('factory') || nameLower.includes('warehouse');
  
  let estimatedFloors = suggestedFootprint?.floors || 8;
  let estimatedHeight = estimatedFloors * 4; // ~4m per floor
  let structuralStyle = 'rectangular';
  let columnDensity = 0.15;
  let windowPattern = 'grid';

  // Adjust based on name hints
  if (isTower) {
    estimatedFloors = Math.max(estimatedFloors, 20);
    estimatedHeight = estimatedFloors * 3.5;
    structuralStyle = 'tower';
    columnDensity = 0.1;
  } else if (isIndustrial) {
    estimatedFloors = Math.max(estimatedFloors, 3);
    estimatedHeight = estimatedFloors * 5;
    structuralStyle = 'industrial';
    columnDensity = 0.25;
  }

  // Adjust based on location
  if (urbanDensity > 10) {
    // High density - taller buildings
    estimatedFloors = Math.max(estimatedFloors, 12);
    estimatedHeight = estimatedFloors * 3.8;
    structuralStyle = structuralStyle === 'rectangular' ? 'modern' : structuralStyle;
  }

  return {
    assetType: 'building',
    estimatedFloors,
    estimatedHeight,
    structuralStyle,
    columnDensity,
    windowPattern,
    baseWidth: suggestedFootprint?.width || 20,
    baseDepth: suggestedFootprint?.depth || 20,
    hasFoundation: true,
    structuralAnalysis: {
      loadCapacity: estimatedFloors * 500,
      windResistance: estimatedHeight > 50 ? 'high' : 'medium',
      seismicZone: 'moderate',
    },
  };
};

/**
 * Generate bridge parameters
 */
const generateBridgeParams = (assetName, locationMetadata) => {
  const { suggestedSpanCount, nearWater, suggestedFootprint } = locationMetadata;
  
  const nameLower = assetName.toLowerCase();
  const isSuspension = nameLower.includes('suspension') || nameLower.includes('吊桥');
  const isArch = nameLower.includes('arch') || nameLower.includes('拱桥');
  
  let bridgeType = 'beam';
  let spanCount = suggestedSpanCount || 2;
  let estimatedLength = suggestedFootprint?.length || 100;
  let deckWidth = 12;

  // Adjust based on name hints
  if (isSuspension) {
    bridgeType = 'suspension';
    spanCount = Math.max(spanCount, 3);
    estimatedLength = Math.max(estimatedLength, 200);
    deckWidth = 15;
  } else if (isArch) {
    bridgeType = 'arch';
    spanCount = Math.max(spanCount, 2);
    estimatedLength = Math.max(estimatedLength, 150);
    deckWidth = 12;
  }

  // Adjust based on location
  if (nearWater) {
    deckWidth = Math.max(deckWidth, 14);
    estimatedLength = Math.max(estimatedLength, 120);
  }

  return {
    assetType: 'bridge',
    bridgeType,
    spanCount,
    estimatedLength,
    deckWidth,
    hasPiers: bridgeType !== 'suspension',
    structuralAnalysis: {
      maxLoad: deckWidth * 20,
      clearance: nearWater ? 15 : 8,
      materialType: 'steel_concrete',
    },
  };
};

/**
 * Generate tunnel parameters
 */
const generateTunnelParams = (assetName, locationMetadata) => {
  const nameLower = assetName.toLowerCase();
  const isRail = nameLower.includes('rail') || nameLower.includes('地铁');
  const isRoad = nameLower.includes('road') || nameLower.includes('highway');
  
  let diameter = 8;
  let segmentCount = 20;
  let length = 500;
  let liningType = 'concrete';
  let lanes = 2;

  // Adjust based on name hints
  if (isRail) {
    diameter = 10;
    segmentCount = 25;
    lanes = 2;
    liningType = 'reinforced_concrete';
  } else if (isRoad) {
    diameter = 10;
    segmentCount = 22;
    lanes = 3;
    liningType = 'steel_fiber_concrete';
  }

  return {
    assetType: 'tunnel',
    diameter,
    segmentCount,
    length,
    liningType,
    lanes,
    hasVentilation: true,
    structuralAnalysis: {
      maxDepth: 50,
      soilType: 'mixed',
      waterTable: 'variable',
    },
  };
};

/**
 * Get default parameters when AI fails
 */
export const getDefaultParams = (assetType) => {
  switch (assetType) {
    case 'building':
      return {
        assetType: 'building',
        estimatedFloors: 8,
        estimatedHeight: 32,
        structuralStyle: 'rectangular',
        columnDensity: 0.15,
        windowPattern: 'grid',
        baseWidth: 20,
        baseDepth: 20,
        hasFoundation: true,
      };
    case 'bridge':
      return {
        assetType: 'bridge',
        bridgeType: 'beam',
        spanCount: 2,
        estimatedLength: 100,
        deckWidth: 12,
        hasPiers: true,
      };
    case 'tunnel':
      return {
        assetType: 'tunnel',
        diameter: 8,
        segmentCount: 20,
        length: 500,
        liningType: 'concrete',
        lanes: 2,
        hasVentilation: true,
      };
    default:
      return {};
  }
};

/**
 * Validate generated parameters
 */
export const validateParams = (params) => {
  if (!params || typeof params !== 'object') {
    return { valid: false, error: 'Invalid parameters' };
  }

  // Check required fields based on type
  switch (params.assetType) {
    case 'building':
      if (!params.estimatedFloors || params.estimatedFloors < 1) {
        return { valid: false, error: 'Invalid floor count' };
      }
      break;
    case 'bridge':
      if (!params.spanCount || params.spanCount < 1) {
        return { valid: false, error: 'Invalid span count' };
      }
      break;
    case 'tunnel':
      if (!params.diameter || params.diameter < 1) {
        return { valid: false, error: 'Invalid diameter' };
      }
      break;
  }

  return { valid: true };
};

export default {
  generateStructuralParams,
  getDefaultParams,
  validateParams,
};

