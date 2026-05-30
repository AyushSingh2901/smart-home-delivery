export const scoreProvider = (provider, { serviceId, urgent = false, coordinates = [] }) => {
  const ratingScore = (provider.rating?.average || 0) * 20;
  const verifiedScore = provider.verified ? 18 : 0;
  const serviceScore = provider.services?.some((service) => service.toString() === serviceId) ? 25 : 0;
  const emergencyScore = urgent && provider.emergencyAvailable ? 18 : 0;
  const [lng, lat] = coordinates;
  let distanceScore = 0;

  if (lng && lat && provider.location?.coordinates?.length === 2) {
    const [providerLng, providerLat] = provider.location.coordinates;
    const distance = Math.hypot(providerLng - lng, providerLat - lat);
    distanceScore = Math.max(0, 20 - distance * 10);
  }

  return ratingScore + verifiedScore + serviceScore + emergencyScore + distanceScore;
};

