// Currency and number formatting utilities

const currencyFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('ja-JP', {
  maximumFractionDigits: 0,
})

export function formatCurrency(value) {
  if (value == null || isNaN(value)) return '¥0'
  return currencyFormatter.format(Math.round(value))
}

export function formatNumber(value) {
  if (value == null || isNaN(value)) return '0'
  return numberFormatter.format(Math.round(value))
}

export function parseNumericInput(input) {
  if (typeof input === 'number') return input
  if (!input) return 0
  const cleaned = String(input).replace(/[^0-9.-]/g, '')
  const parsed = parseInt(cleaned, 10)
  return isNaN(parsed) ? 0 : parsed
}

export function formatInputValue(value) {
  if (value === 0 || value === '') return ''
  return formatNumber(value)
}
