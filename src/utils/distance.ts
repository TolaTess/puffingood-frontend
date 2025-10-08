// Utility functions for calculating distances and checking delivery areas

// Galway city center coordinates (approximate)
const GALWAY_CENTER = {
  latitude: 53.2707,
  longitude: -9.0568
};

// Function to calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Function to check if a location is within Galway delivery radius
export function isWithinGalwayDeliveryRadius(
  latitude: number,
  longitude: number,
  radiusKm: number = 10
): boolean {
  const distance = calculateDistance(
    GALWAY_CENTER.latitude,
    GALWAY_CENTER.longitude,
    latitude,
    longitude
  );
  return distance <= radiusKm;
}

// Function to get coordinates from address (this would typically use a geocoding service)
// For now, we'll use a simple mapping of common Galway areas
export function getCoordinatesFromAddress(address: string, city: string): { latitude: number; longitude: number } | null {
  const normalizedAddress = `${address} ${city}`.toLowerCase();
  
  // Common Galway areas with approximate coordinates
  const galwayAreas = {
    'galway city': { latitude: 53.2707, longitude: -9.0568 },
    'eyre square': { latitude: 53.2744, longitude: -9.0489 },
    'salthill': { latitude: 53.2561, longitude: -9.0889 },
    'knocknacarra': { latitude: 53.2561, longitude: -9.0889 },
    'ballybane': { latitude: 53.2800, longitude: -8.9800 },
    'ballybrit': { latitude: 53.2800, longitude: -8.9800 },
    'doughiska': { latitude: 53.2800, longitude: -8.9800 },
    'renmore': { latitude: 53.2800, longitude: -8.9800 },
    'newcastle': { latitude: 53.2800, longitude: -8.9800 },
    'taylors hill': { latitude: 53.2561, longitude: -9.0889 },
    'barnagh': { latitude: 53.2561, longitude: -9.0889 },
    'wellpark': { latitude: 53.2800, longitude: -8.9800 },
    'bohermore': { latitude: 53.2800, longitude: -8.9800 },
    'shantalla': { latitude: 53.2800, longitude: -8.9800 },
    'headford road': { latitude: 53.2800, longitude: -8.9800 },
    'tuam road': { latitude: 53.2800, longitude: -8.9800 },
    'claddagh': { latitude: 53.2561, longitude: -9.0889 },
    'westside': { latitude: 53.2561, longitude: -9.0889 },
    'merlin park': { latitude: 53.2800, longitude: -8.9800 },
    'terryland': { latitude: 53.2800, longitude: -8.9800 },
    'mervue': { latitude: 53.2800, longitude: -8.9800 },
    'ballybrit': { latitude: 53.2800, longitude: -8.9800 },
    'carnmore': { latitude: 53.2800, longitude: -8.9800 },
    'orranmore': { latitude: 53.2800, longitude: -8.9800 },
    'claregalway': { latitude: 53.2800, longitude: -8.9800 },
    'athenry': { latitude: 53.2800, longitude: -8.9800 },
    'loughrea': { latitude: 53.2800, longitude: -8.9800 },
    'gort': { latitude: 53.2800, longitude: -8.9800 },
    'portumna': { latitude: 53.2800, longitude: -8.9800 },
    'ballinasloe': { latitude: 53.2800, longitude: -8.9800 },
    'tuam': { latitude: 53.2800, longitude: -8.9800 },
    'headford': { latitude: 53.2800, longitude: -8.9800 },
    'mountbellew': { latitude: 53.2800, longitude: -8.9800 },
    'glenamaddy': { latitude: 53.2800, longitude: -8.9800 },
    'williamstown': { latitude: 53.2800, longitude: -8.9800 },
    'dunmore': { latitude: 53.2800, longitude: -8.9800 },
    'milltown': { latitude: 53.2800, longitude: -8.9800 },
    'kilkerrin': { latitude: 53.2800, longitude: -8.9800 },
    'caltra': { latitude: 53.2800, longitude: -8.9800 },
    'newbridge': { latitude: 53.2800, longitude: -8.9800 },
    'ahascragh': { latitude: 53.2800, longitude: -8.9800 },
    'kilconnell': { latitude: 53.2800, longitude: -8.9800 },
    'kilchreest': { latitude: 53.2800, longitude: -8.9800 },
    'kilbeacanty': { latitude: 53.2800, longitude: -8.9800 },
    'kilreekill': { latitude: 53.2800, longitude: -8.9800 },
    'kilnadeema': { latitude: 53.2800, longitude: -8.9800 },
    'kilthomas': { latitude: 53.2800, longitude: -8.9800 },
    'kilchreest': { latitude: 53.2800, longitude: -8.9800 },
    'kilbeacanty': { latitude: 53.2800, longitude: -8.9800 },
    'kilreekill': { latitude: 53.2800, longitude: -8.9800 },
    'kilnadeema': { latitude: 53.2800, longitude: -8.9800 },
    'kilthomas': { latitude: 53.2800, longitude: -8.9800 },
  };

  // Check for exact matches first
  for (const [area, coords] of Object.entries(galwayAreas)) {
    if (normalizedAddress.includes(area)) {
      return coords;
    }
  }

  // If no specific area found but city is Galway, return city center
  if (city.toLowerCase().includes('galway')) {
    return GALWAY_CENTER;
  }

  return null;
}

// Function to check if an address is eligible for Galway local delivery
export function isEligibleForGalwayDelivery(address: string, city: string): boolean {
  const coords = getCoordinatesFromAddress(address, city);
  if (!coords) return false;
  
  return isWithinGalwayDeliveryRadius(coords.latitude, coords.longitude, 10);
}
