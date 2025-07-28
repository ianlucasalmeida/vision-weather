// utils/locationUtils.js
// Funções auxiliares relacionadas à localização.

import haversine from 'haversine';

export const calculateDistance = (start, end) => {
  // start e end são objetos { latitude, longitude }
  const distanceInKm = haversine(start, end, { unit: 'km' });
  return Math.round(distanceInKm);
};
