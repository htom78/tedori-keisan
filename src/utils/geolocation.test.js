import { describe, it, expect } from 'vitest'
import { findNearestPrefecture } from './geolocation'

describe('findNearestPrefecture', () => {
  it('returns index 0 for Sapporo coordinates (Hokkaido)', () => {
    expect(findNearestPrefecture(43.06, 141.35)).toBe(0)
  })

  it('returns index 12 for Tokyo coordinates', () => {
    expect(findNearestPrefecture(35.6894, 139.6917)).toBe(12)
  })

  it('returns index 22 for Nagoya coordinates (Aichi)', () => {
    expect(findNearestPrefecture(35.18, 136.91)).toBe(22)
  })

  it('returns index 26 for Osaka coordinates', () => {
    expect(findNearestPrefecture(34.69, 135.50)).toBe(26)
  })

  it('returns index 46 for Naha coordinates (Okinawa)', () => {
    expect(findNearestPrefecture(26.33, 127.80)).toBe(46)
  })

  it('returns nearest prefecture for coordinates between capitals', () => {
    // Coordinates near Yokohama should resolve to Kanagawa (index 13)
    expect(findNearestPrefecture(35.44, 139.64)).toBe(13)
  })

  it('returns nearest prefecture for coordinates in northern Tohoku', () => {
    // Near Aomori city should resolve to Aomori (index 1)
    expect(findNearestPrefecture(40.82, 140.74)).toBe(1)
  })
})
