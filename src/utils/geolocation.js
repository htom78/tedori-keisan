import { PREFECTURE_COORDINATES } from '../constants/prefectureCoordinates'

export const ERROR_CODES = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE: 'POSITION_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  GEOLOCATION_NOT_SUPPORTED: 'GEOLOCATION_NOT_SUPPORTED',
}

/**
 * Find the nearest prefecture index using Euclidean distance.
 * Sufficient for prefecture-level accuracy within Japan's latitude range.
 */
export function findNearestPrefecture(lat, lng) {
  let minDist = Infinity
  let nearest = 0

  for (let i = 0; i < PREFECTURE_COORDINATES.length; i++) {
    const coord = PREFECTURE_COORDINATES[i]
    const dLat = lat - coord.lat
    const dLng = lng - coord.lng
    const dist = dLat * dLat + dLng * dLng
    if (dist < minDist) {
      minDist = dist
      nearest = i
    }
  }

  return nearest
}

/**
 * Promise wrapper for navigator.geolocation.getCurrentPosition
 * with error normalization.
 */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(ERROR_CODES.GEOLOCATION_NOT_SUPPORTED)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        switch (error.code) {
          case 1:
            reject(ERROR_CODES.PERMISSION_DENIED)
            break
          case 2:
            reject(ERROR_CODES.POSITION_UNAVAILABLE)
            break
          case 3:
            reject(ERROR_CODES.TIMEOUT)
            break
          default:
            reject(ERROR_CODES.POSITION_UNAVAILABLE)
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  })
}
