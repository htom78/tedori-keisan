import { useState, useCallback } from 'react'
import { getCurrentPosition, findNearestPrefecture } from '../utils/geolocation'

export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorCode, setErrorCode] = useState(null)

  const detectPrefecture = useCallback(async () => {
    setIsLoading(true)
    setErrorCode(null)

    try {
      const { lat, lng } = await getCurrentPosition()
      const index = findNearestPrefecture(lat, lng)
      return index
    } catch (code) {
      setErrorCode(code)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setErrorCode(null)
  }, [])

  return { detectPrefecture, isLoading, errorCode, clearError }
}
