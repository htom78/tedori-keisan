import { describe, it, expect } from 'vitest'
import {
  calculateHealthInsurance,
  calculatePension,
  calculateNursing,
  calculateEmployment,
  calculateWithholdingTax,
  calculateResidentTax,
  calculateTakeHome,
} from './calculator'

// Default settings for a typical ¥300,000 salary in Tokyo, under 40
const defaultSettings = {
  salary: 300000,
  month: 6,
  prefectureIndex: 12, // Tokyo
  ageGroup: 'under40',
  healthMode: 'auto',
  healthIsKyokai: true,
  healthCustomAmount: 0,
  healthStandardGrade: null,
  pensionMode: 'auto',
  pensionCustomAmount: 0,
  pensionStandardGrade: null,
  nursingIsCollected: false,
  nursingUseCustom: false,
  nursingCustomAmount: 0,
  employmentRate: 0.55,
  employmentJoined: true,
  dependents: 0,
  isElectronic: false,
  isTaxExempt: false,
  isNonResident: false,
  residentTaxMode: 'auto',
  residentTaxCustomAnnual: 0,
  residentTaxHidden: false,
  allowances: [],
  bonusMonths: [],
  deductions: [],
}

describe('calculateHealthInsurance', () => {
  it('calculates auto mode for ¥300,000 in Tokyo (grade 22 = ¥300,000)', () => {
    const result = calculateHealthInsurance({
      mode: 'auto',
      salary: 300000,
      prefectureIndex: 12,
      isKyokai: true,
      customAmount: 0,
      standardGrade: null,
    })
    // Standard remuneration = ¥300,000, Tokyo rate = 9.91%, employee = half
    expect(result).toBe(Math.round(300000 * (9.91 / 100) / 2))
  })

  it('returns custom amount in custom mode', () => {
    const result = calculateHealthInsurance({
      mode: 'custom',
      salary: 300000,
      prefectureIndex: 12,
      isKyokai: true,
      customAmount: 12345,
      standardGrade: null,
    })
    expect(result).toBe(12345)
  })

  it('uses union health rate when not Kyokai', () => {
    const result = calculateHealthInsurance({
      mode: 'auto',
      salary: 300000,
      prefectureIndex: 12,
      isKyokai: false,
      customAmount: 0,
      standardGrade: null,
    })
    // Union rate = 9.50%
    expect(result).toBe(Math.round(300000 * (9.50 / 100) / 2))
  })

  it('uses standard grade when specified', () => {
    const result = calculateHealthInsurance({
      mode: 'standard',
      salary: 300000,
      prefectureIndex: 12,
      isKyokai: true,
      customAmount: 0,
      standardGrade: 25, // grade 26 = ¥380,000
    })
    expect(result).toBe(Math.round(380000 * (9.91 / 100) / 2))
  })
})

describe('calculatePension', () => {
  it('calculates auto mode for ¥300,000 (grade 19 = ¥300,000)', () => {
    const result = calculatePension({
      mode: 'auto',
      salary: 300000,
      customAmount: 0,
      standardGrade: null,
    })
    // Pension rate = 18.3%, employee = half
    expect(result).toBe(Math.round(300000 * (18.3 / 100) / 2))
  })

  it('returns custom amount in custom mode', () => {
    const result = calculatePension({
      mode: 'custom',
      salary: 300000,
      customAmount: 27450,
      standardGrade: null,
    })
    expect(result).toBe(27450)
  })

  it('caps at maximum grade (¥650,000) for high salaries', () => {
    const result = calculatePension({
      mode: 'auto',
      salary: 1000000,
      customAmount: 0,
      standardGrade: null,
    })
    expect(result).toBe(Math.round(650000 * (18.3 / 100) / 2))
  })
})

describe('calculateNursing', () => {
  it('returns 0 when not collected', () => {
    const result = calculateNursing({
      isCollected: false,
      salary: 300000,
    })
    expect(result).toBe(0)
  })

  it('calculates nursing insurance when collected', () => {
    const result = calculateNursing({
      isCollected: true,
      useCustom: false,
      salary: 300000,
      prefectureIndex: 12,
      isKyokai: true,
      healthMode: 'auto',
      healthStandardGrade: null,
    })
    // Nursing rate = 1.82%, employee = half, standard = ¥300,000
    expect(result).toBe(Math.round(300000 * (1.82 / 100) / 2))
  })

  it('returns custom amount when useCustom is true', () => {
    const result = calculateNursing({
      isCollected: true,
      useCustom: true,
      customAmount: 5000,
      salary: 300000,
    })
    expect(result).toBe(5000)
  })
})

describe('calculateEmployment', () => {
  it('calculates general rate (0.55%)', () => {
    const result = calculateEmployment({
      salary: 300000,
      rate: 0.55,
      totalEarnings: 300000,
    })
    expect(result).toBe(Math.round(300000 * 0.0055))
  })

  it('caps at ¥1,620,000', () => {
    const result = calculateEmployment({
      salary: 2000000,
      rate: 0.55,
      totalEarnings: 2000000,
    })
    expect(result).toBe(Math.round(1620000 * 0.0055))
  })
})

describe('calculateWithholdingTax', () => {
  it('returns 0 when exempt', () => {
    const result = calculateWithholdingTax({
      monthlySalary: 300000,
      socialInsuranceTotal: 40000,
      isExempt: true,
    })
    expect(result).toBe(0)
  })

  it('calculates non-resident flat rate (20.42%)', () => {
    const result = calculateWithholdingTax({
      monthlySalary: 300000,
      socialInsuranceTotal: 40000,
      isNonResident: true,
    })
    const taxableBase = 300000 - 40000
    expect(result).toBe(Math.round(taxableBase * 0.2042))
  })

  it('deducts tax-exempt allowances from taxable base', () => {
    const withExempt = calculateWithholdingTax({
      monthlySalary: 300000,
      socialInsuranceTotal: 40000,
      taxExemptAllowances: 15000,
    })
    const withoutExempt = calculateWithholdingTax({
      monthlySalary: 300000,
      socialInsuranceTotal: 40000,
      taxExemptAllowances: 0,
    })
    expect(withExempt).toBeLessThan(withoutExempt)
  })

  it('reduces tax for dependents', () => {
    const noDeps = calculateWithholdingTax({
      monthlySalary: 300000,
      socialInsuranceTotal: 40000,
      dependents: 0,
    })
    const withDeps = calculateWithholdingTax({
      monthlySalary: 300000,
      socialInsuranceTotal: 40000,
      dependents: 2,
    })
    expect(withDeps).toBeLessThan(noDeps)
  })

  it('returns 0 for salary below ¥88,000 threshold', () => {
    const result = calculateWithholdingTax({
      monthlySalary: 80000,
      socialInsuranceTotal: 0,
    })
    expect(result).toBe(0)
  })
})

describe('calculateResidentTax', () => {
  it('returns manual amount divided by 12', () => {
    const result = calculateResidentTax({
      mode: 'manual',
      customAnnualAmount: 120000,
    })
    expect(result).toBe(10000)
  })

  it('calculates auto mode', () => {
    const result = calculateResidentTax({
      mode: 'auto',
      annualSalary: 3600000,
      socialInsuranceMonthly: 40000,
    })
    expect(result).toBeGreaterThan(0)
    expect(Number.isInteger(result)).toBe(true)
  })
})

describe('calculateTakeHome', () => {
  it('returns all expected fields', () => {
    const result = calculateTakeHome(defaultSettings)
    expect(result).toHaveProperty('grossSalary')
    expect(result).toHaveProperty('baseSalary')
    expect(result).toHaveProperty('totalAllowances')
    expect(result).toHaveProperty('bonusAmount')
    expect(result).toHaveProperty('healthInsurance')
    expect(result).toHaveProperty('pensionInsurance')
    expect(result).toHaveProperty('nursingInsurance')
    expect(result).toHaveProperty('employmentInsurance')
    expect(result).toHaveProperty('socialInsuranceTotal')
    expect(result).toHaveProperty('withholdingTax')
    expect(result).toHaveProperty('residentTax')
    expect(result).toHaveProperty('totalDeductions')
    expect(result).toHaveProperty('takeHome')
    expect(result).toHaveProperty('deductionRate')
    expect(result).toHaveProperty('taxExemptAllowances')
    expect(result).toHaveProperty('siExemptAllowances')
  })

  it('gross = base + allowances + bonus', () => {
    const result = calculateTakeHome({
      ...defaultSettings,
      salary: 300000,
      allowances: [{ id: '1', name: 'test', amount: 20000 }],
      bonusMonths: [{ id: 'b1', month: 6, amount: 500000, enabled: true }],
    })
    expect(result.grossSalary).toBe(300000 + 20000 + 500000)
  })

  it('takeHome = gross - totalDeductions', () => {
    const result = calculateTakeHome(defaultSettings)
    expect(result.takeHome).toBe(result.grossSalary - result.totalDeductions)
  })

  it('siExempt allowances reduce SI but not gross', () => {
    const base = calculateTakeHome({
      ...defaultSettings,
      allowances: [{ id: '1', name: 'commute', amount: 15000 }],
    })
    const withSiExempt = calculateTakeHome({
      ...defaultSettings,
      allowances: [{ id: '1', name: 'commute', amount: 15000, siExempt: true }],
    })
    // Gross should be the same
    expect(withSiExempt.grossSalary).toBe(base.grossSalary)
    // SI should be lower (or equal if same grade boundary)
    expect(withSiExempt.socialInsuranceTotal).toBeLessThanOrEqual(base.socialInsuranceTotal)
    // siExemptAllowances tracked
    expect(withSiExempt.siExemptAllowances).toBe(15000)
    expect(base.siExemptAllowances).toBe(0)
  })

  it('taxExempt and siExempt work independently', () => {
    const both = calculateTakeHome({
      ...defaultSettings,
      allowances: [{ id: '1', name: 'commute', amount: 15000, taxExempt: true, siExempt: true }],
    })
    expect(both.taxExemptAllowances).toBe(15000)
    expect(both.siExemptAllowances).toBe(15000)
  })

  it('handles no bonus in non-bonus month', () => {
    const result = calculateTakeHome({
      ...defaultSettings,
      month: 3,
      bonusMonths: [{ id: 'b1', month: 6, amount: 500000, enabled: true }],
    })
    expect(result.bonusAmount).toBe(0)
    expect(result.isBonusMonth).toBe(false)
  })

  it('includes bonus in bonus month', () => {
    const result = calculateTakeHome({
      ...defaultSettings,
      month: 6,
      bonusMonths: [{ id: 'b1', month: 6, amount: 500000, enabled: true }],
    })
    expect(result.bonusAmount).toBe(500000)
    expect(result.isBonusMonth).toBe(true)
  })

  it('disabled bonus month is ignored', () => {
    const result = calculateTakeHome({
      ...defaultSettings,
      month: 6,
      bonusMonths: [{ id: 'b1', month: 6, amount: 500000, enabled: false }],
    })
    expect(result.bonusAmount).toBe(0)
    expect(result.isBonusMonth).toBe(false)
  })

  it('deductions reduce take-home', () => {
    const noDeductions = calculateTakeHome(defaultSettings)
    const withDeductions = calculateTakeHome({
      ...defaultSettings,
      deductions: [{ id: 'd1', name: 'union', amount: 3000 }],
    })
    expect(withDeductions.takeHome).toBe(noDeductions.takeHome - 3000)
    expect(withDeductions.totalOtherDeductions).toBe(3000)
  })

  it('nursing is 0 for under40', () => {
    const result = calculateTakeHome({
      ...defaultSettings,
      nursingIsCollected: false,
    })
    expect(result.nursingInsurance).toBe(0)
  })

  it('hidden resident tax returns 0', () => {
    const result = calculateTakeHome({
      ...defaultSettings,
      residentTaxHidden: true,
    })
    expect(result.residentTax).toBe(0)
  })
})
