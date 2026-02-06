import { describe, it, expect } from 'vitest'
import { formatCurrency, formatNumber, parseNumericInput, formatInputValue } from './format'

describe('formatCurrency', () => {
  it('formats positive integers', () => {
    const result = formatCurrency(300000)
    expect(result).toContain('300,000')
    expect(result).toMatch(/[¥￥]/)
  })

  it('rounds to nearest yen', () => {
    const result = formatCurrency(123.7)
    expect(result).toContain('124')
    expect(result).toMatch(/[¥￥]/)
  })

  it('handles zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
    expect(result).toMatch(/[¥￥]/)
  })

  it('handles null/undefined/NaN', () => {
    expect(formatCurrency(null)).toMatch(/[¥￥]0/)
    expect(formatCurrency(undefined)).toMatch(/[¥￥]0/)
    expect(formatCurrency(NaN)).toMatch(/[¥￥]0/)
  })

  it('formats negative values', () => {
    const result = formatCurrency(-5000)
    expect(result).toContain('5,000')
  })
})

describe('formatNumber', () => {
  it('formats with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('handles null/undefined/NaN', () => {
    expect(formatNumber(null)).toBe('0')
    expect(formatNumber(undefined)).toBe('0')
    expect(formatNumber(NaN)).toBe('0')
  })
})

describe('parseNumericInput', () => {
  it('parses numeric strings', () => {
    expect(parseNumericInput('300000')).toBe(300000)
  })

  it('strips commas and formatting', () => {
    expect(parseNumericInput('300,000')).toBe(300000)
  })

  it('returns number if already number', () => {
    expect(parseNumericInput(42)).toBe(42)
  })

  it('returns 0 for empty/null/undefined', () => {
    expect(parseNumericInput('')).toBe(0)
    expect(parseNumericInput(null)).toBe(0)
    expect(parseNumericInput(undefined)).toBe(0)
  })

  it('returns 0 for non-numeric strings', () => {
    expect(parseNumericInput('abc')).toBe(0)
  })
})

describe('formatInputValue', () => {
  it('returns empty string for 0', () => {
    expect(formatInputValue(0)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(formatInputValue('')).toBe('')
  })

  it('formats non-zero values', () => {
    expect(formatInputValue(300000)).toBe('300,000')
  })
})
