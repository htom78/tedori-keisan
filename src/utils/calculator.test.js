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
  isTaxExempt: false,
  isNonResident: false,
  taxColumn: 'kou',
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
    // Default union rate = 9.50%
    expect(result).toBe(Math.round(300000 * (9.50 / 100) / 2))
  })

  it('uses custom union rate when provided', () => {
    const result = calculateHealthInsurance({
      mode: 'auto',
      salary: 300000,
      prefectureIndex: 12,
      isKyokai: false,
      customAmount: 0,
      standardGrade: null,
      healthUnionRate: 8.50,
    })
    expect(result).toBe(Math.round(300000 * (8.50 / 100) / 2))
  })

  it('uses fRound (50銭以下切捨て) for health insurance', () => {
    // ¥150,000 × 9.91% / 2 = 7,432.5 → fRound = 7,432 (not 7,433)
    const result = calculateHealthInsurance({
      mode: 'auto',
      salary: 150000,
      prefectureIndex: 12, // Tokyo 9.91%
      isKyokai: true,
      customAmount: 0,
      standardGrade: null,
    })
    expect(result).toBe(7432)
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

  it('calculates nursing insurance when collected (Reiwa 8 rate 1.59%)', () => {
    const result = calculateNursing({
      isCollected: true,
      useCustom: false,
      salary: 300000,
      prefectureIndex: 12,
      isKyokai: true,
      healthMode: 'auto',
      healthStandardGrade: null,
    })
    // Nursing rate = 1.59%, employee = half, standard = ¥300,000
    expect(result).toBe(Math.round(300000 * (1.59 / 100) / 2))
  })

  it('uses custom nursing union rate when provided', () => {
    const result = calculateNursing({
      isCollected: true,
      useCustom: false,
      salary: 300000,
      healthMode: 'auto',
      healthStandardGrade: null,
      nursingUnionRate: 1.20,
    })
    expect(result).toBe(Math.round(300000 * (1.20 / 100) / 2))
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
  it('calculates general rate (0.55%) with Math.floor', () => {
    const result = calculateEmployment({
      salary: 300000,
      rate: 0.55,
      totalEarnings: 300000,
    })
    // Math.floor(300000 * 0.0055) = Math.floor(1650) = 1650
    expect(result).toBe(Math.floor(300000 * 0.0055))
  })

  it('uses Math.floor rounding (not Math.round)', () => {
    // Pick a salary that produces a fractional result
    const result = calculateEmployment({
      salary: 333333,
      rate: 0.55,
      totalEarnings: 333333,
    })
    // Math.floor(333333 * 0.0055) = Math.floor(1833.3315) = 1833
    expect(result).toBe(1833)
    // Not Math.round which would give 1833 too in this case
    // But verify the floor behavior with another value
    const result2 = calculateEmployment({
      salary: 272727,
      rate: 0.55,
      totalEarnings: 272727,
    })
    // Math.floor(272727 * 0.0055) = Math.floor(1499.9985) = 1499
    expect(result2).toBe(1499)
  })

  it('has no monthly cap (unlike previous implementation)', () => {
    const result = calculateEmployment({
      salary: 2000000,
      rate: 0.55,
      totalEarnings: 2000000,
    })
    // No cap, should be floor(2000000 * 0.0055) = 11000
    expect(result).toBe(Math.floor(2000000 * 0.0055))
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

  it('calculates non-resident flat rate (20.42%) with Math.floor', () => {
    const result = calculateWithholdingTax({
      monthlySalary: 300000,
      socialInsuranceTotal: 40000,
      isNonResident: true,
    })
    const taxableBase = 300000 - 40000
    // Math.floor(260000 * 0.2042) = Math.floor(53092) = 53092
    expect(result).toBe(Math.floor(taxableBase * 0.2042))
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

  it('reduces tax for dependents (甲欄)', () => {
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

  it('returns 0 for very low salary (below deduction threshold)', () => {
    const result = calculateWithholdingTax({
      monthlySalary: 80000,
      socialInsuranceTotal: 0,
    })
    // After salary deduction and basic deduction, taxable should be <= 0
    expect(result).toBe(0)
  })

  describe('電算機特例 (electronic formula)', () => {
    it('calculates correctly for ¥300,000 salary, ¥43,965 SI, 0 dependents', () => {
      const result = calculateWithholdingTax({
        monthlySalary: 300000,
        socialInsuranceTotal: 43965,
        dependents: 0,
        taxColumn: 'kou',
      })
      // afterSi = 256035
      // salaryDeduction: floor(256035 * 0.3) + 6667 = 76810 + 6667 = 83477
      // employmentIncome = 256035 - 83477 = 172558
      // basicDeduction = 40000 (< 2162499)
      // taxable = 172558 - 40000 = 132558
      // tax = floor(132558 * 0.05105 - 0) = floor(6767.08) = 6767
      // rounded = round(6767 / 10) * 10 = 6770
      expect(result).toBe(6770)
    })

    it('calculates correctly for ¥500,000 salary, ¥70,000 SI, 2 dependents', () => {
      const result = calculateWithholdingTax({
        monthlySalary: 500000,
        socialInsuranceTotal: 70000,
        dependents: 2,
        taxColumn: 'kou',
      })
      // afterSi = 430000
      // salaryDeduction: floor(430000 * 0.2) + 36667 = 86000 + 36667 = 122667
      // employmentIncome = 430000 - 122667 = 307333
      // basicDeduction = 40000
      // dependentDeduction = 2 * 31667 = 63334
      // taxable = 307333 - 40000 - 63334 = 203999
      // bracket: 203999 <= 275000, rate 0.10210, deduction 8296
      // tax = floor(203999 * 0.10210 - 8296) = floor(20828.5 - 8296) = floor(12532.5) = 12532
      // rounded = round(12532 / 10) * 10 = 12530
      expect(result).toBe(12530)
    })

    it('returns rounded to nearest 10 yen', () => {
      const result = calculateWithholdingTax({
        monthlySalary: 300000,
        socialInsuranceTotal: 43965,
        dependents: 0,
        taxColumn: 'kou',
      })
      expect(result % 10).toBe(0)
    })
  })

  describe('乙欄 電算機特例 (secondary employment)', () => {
    it('calculates higher tax than 甲欄 for same salary', () => {
      const kou = calculateWithholdingTax({
        monthlySalary: 300000,
        socialInsuranceTotal: 40000,
        dependents: 0,
        taxColumn: 'kou',
      })
      const otsu = calculateWithholdingTax({
        monthlySalary: 300000,
        socialInsuranceTotal: 40000,
        dependents: 0,
        taxColumn: 'otsu',
      })
      expect(otsu).toBeGreaterThan(kou)
    })

    it('ignores dependents (always same tax regardless)', () => {
      const noDeps = calculateWithholdingTax({
        monthlySalary: 300000,
        socialInsuranceTotal: 40000,
        dependents: 0,
        taxColumn: 'otsu',
      })
      const withDeps = calculateWithholdingTax({
        monthlySalary: 300000,
        socialInsuranceTotal: 40000,
        dependents: 3,
        taxColumn: 'otsu',
      })
      expect(noDeps).toBe(withDeps)
    })

    it('Range 1: afterSi < 105,000 → floor(afterSi × 3.063%)', () => {
      // afterSi = 88,000 → floor(88000 * 0.03063) = floor(2695.44) = 2695
      const result = calculateWithholdingTax({
        monthlySalary: 88000,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      expect(result).toBe(2695)
    })

    it('Range 2: afterSi = 200,000 → 計算基準額方式', () => {
      // afterSi = 200,000 → base=199,000
      // A(497500): deduction=136167, taxable=312999, tax=26974
      // B(298500): deduction=96217, taxable=153949, tax=7697
      // C = round100(19277) = 19300, final = round100(19300*1.021) = 19700
      const result = calculateWithholdingTax({
        monthlySalary: 200000,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      expect(result).toBe(19700)
    })

    it('Range 2: afterSi = 260,000 (¥300K salary - ¥40K SI)', () => {
      const result = calculateWithholdingTax({
        monthlySalary: 300000,
        socialInsuranceTotal: 40000,
        taxColumn: 'otsu',
      })
      expect(result).toBe(39600)
    })

    it('Range 2: afterSi = 300,000', () => {
      const result = calculateWithholdingTax({
        monthlySalary: 300000,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      expect(result).toBe(53600)
    })

    it('Range 3: afterSi = 1,000,000', () => {
      // 259200 + (1000000 - 740000) * 0.4084 = 259200 + 106184 = 365384
      const result = calculateWithholdingTax({
        monthlySalary: 1000000,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      expect(result).toBe(365384)
    })

    it('Range 4: afterSi = 2,000,000', () => {
      // 655400 + (2000000 - 1710000) * 0.45945 = 655400 + 133240.5 = 788640
      const result = calculateWithholdingTax({
        monthlySalary: 2000000,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      expect(result).toBe(788640)
    })

    it('boundary: afterSi = 104,999 (Range 1) vs 105,000 (Range 2)', () => {
      const range1 = calculateWithholdingTax({
        monthlySalary: 104999,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      const range2 = calculateWithholdingTax({
        monthlySalary: 105000,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      expect(range1).toBe(3216) // floor(104999 * 0.03063)
      expect(range2).toBe(3800) // 計算基準額方式
    })

    it('boundary: step size changes at 220,999 / 221,000', () => {
      const step2000 = calculateWithholdingTax({
        monthlySalary: 220999,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      const step3000 = calculateWithholdingTax({
        monthlySalary: 221000,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      expect(step2000).toBe(25800)
      expect(step3000).toBe(26400)
    })

    it('boundary: afterSi = 740,000 (Range 2) vs 740,001 (Range 3)', () => {
      const range2 = calculateWithholdingTax({
        monthlySalary: 740000,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      const range3 = calculateWithholdingTax({
        monthlySalary: 740001,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      expect(range2).toBe(259200)
      expect(range3).toBe(259200) // floor(259200 + 1*0.4084)
    })

    it('boundary: afterSi = 1,709,999 (Range 3) vs 1,710,000 (Range 4)', () => {
      const range3 = calculateWithholdingTax({
        monthlySalary: 1709999,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      const range4 = calculateWithholdingTax({
        monthlySalary: 1710000,
        socialInsuranceTotal: 0,
        taxColumn: 'otsu',
      })
      expect(range3).toBe(655347) // floor(259200 + 969999*0.4084)
      expect(range4).toBe(655400) // floor(655400 + 0)
    })

    it('returns 0 for afterSi <= 0', () => {
      const result = calculateWithholdingTax({
        monthlySalary: 10000,
        socialInsuranceTotal: 20000,
        taxColumn: 'otsu',
      })
      expect(result).toBe(0)
    })

    it('Range 2 results are multiples of 100 (50円丸め)', () => {
      for (const salary of [105000, 200000, 300000, 500000, 740000]) {
        const result = calculateWithholdingTax({
          monthlySalary: salary,
          socialInsuranceTotal: 0,
          taxColumn: 'otsu',
        })
        expect(result % 100).toBe(0)
      }
    })
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
    expect(withSiExempt.grossSalary).toBe(base.grossSalary)
    expect(withSiExempt.socialInsuranceTotal).toBeLessThanOrEqual(base.socialInsuranceTotal)
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

  it('passes healthUnionRate and nursingUnionRate through', () => {
    const withUnionRates = calculateTakeHome({
      ...defaultSettings,
      healthIsKyokai: false,
      healthUnionRate: 8.00,
      nursingIsCollected: true,
      nursingUnionRate: 1.20,
    })
    // Health: 300000 * 8.00% / 2 = 12000
    expect(withUnionRates.healthInsurance).toBe(12000)
    // Nursing: 300000 * 1.20% / 2 = 1800
    expect(withUnionRates.nursingInsurance).toBe(1800)
  })

  it('uses 乙欄 when taxColumn is otsu', () => {
    const kouResult = calculateTakeHome({
      ...defaultSettings,
      taxColumn: 'kou',
    })
    const otsuResult = calculateTakeHome({
      ...defaultSettings,
      taxColumn: 'otsu',
    })
    expect(otsuResult.withholdingTax).toBeGreaterThan(kouResult.withholdingTax)
  })

  describe('cross-verification: ¥300,000 Tokyo under40 0 dependents', () => {
    it('matches expected breakdown', () => {
      const result = calculateTakeHome(defaultSettings)

      // Health: standard ¥300,000 × 9.91% / 2 = 14,865
      expect(result.healthInsurance).toBe(14865)

      // Pension: standard ¥300,000 × 18.3% / 2 = 27,450
      expect(result.pensionInsurance).toBe(27450)

      // Nursing: 0 (under 40)
      expect(result.nursingInsurance).toBe(0)

      // Employment: floor(300000 * 0.0055) = 1650
      expect(result.employmentInsurance).toBe(1650)

      // Total SI: 14865 + 27450 + 0 + 1650 = 43965
      expect(result.socialInsuranceTotal).toBe(43965)

      // Withholding: 電算機特例 = 6770 (verified in withholding test)
      expect(result.withholdingTax).toBe(6770)
    })
  })
})
