// Pure calculation functions for Japanese salary deductions
// All amounts are in integer yen

import {
  HEALTH_STANDARD_TABLE,
  PENSION_STANDARD_TABLE,
  PREFECTURES,
  RATES,
  MONTHLY_SALARY_DEDUCTION,
  MONTHLY_BASIC_DEDUCTION,
  MONTHLY_TAX_BRACKETS,
  OTSU_TAX_BRACKETS,
  NON_RESIDENT_TAX_RATE,
  RESIDENT_TAX_RATE,
  SALARY_DEDUCTION_TABLE,
  SI_MODES,
  COMMUTE_TAX_FREE_LIMIT,
  PENSION_BONUS_CAP,
} from '../constants/taxData'

// 50銭以下切捨て、50銭超え切上げ (Japanese regulatory rounding for social insurance)
// Differs from Math.round only at exactly .5: fRound(.5)=0, Math.round(.5)=1
// Uses tolerance to handle floating point imprecision (e.g., 7432.5000000000001)
function fRound(value) {
  const fractional = value - Math.floor(value)
  if (Math.abs(fractional - 0.5) < 1e-6) {
    return Math.floor(value)
  }
  return Math.round(value)
}

// Look up standard remuneration from a table given a salary
function lookupStandard(table, salary) {
  for (const [, standard, lower, upper] of table) {
    if (salary >= lower && salary < upper) {
      return standard
    }
  }
  const last = table[table.length - 1]
  return last[1]
}

// Calculate health insurance (employee share)
export function calculateHealthInsurance(settings) {
  const {
    mode,
    salary,
    prefectureIndex,
    isKyokai,
    customAmount,
    standardGrade,
    healthUnionRate,
  } = settings

  if (mode === SI_MODES.CUSTOM) {
    return Math.round(customAmount || 0)
  }

  let standardRemuneration
  if (mode === SI_MODES.STANDARD && standardGrade != null) {
    const entry = HEALTH_STANDARD_TABLE[standardGrade]
    standardRemuneration = entry ? entry[1] : lookupStandard(HEALTH_STANDARD_TABLE, salary)
  } else {
    standardRemuneration = lookupStandard(HEALTH_STANDARD_TABLE, salary)
  }

  let totalRate
  if (isKyokai) {
    const prefecture = PREFECTURES[prefectureIndex] || PREFECTURES[12]
    totalRate = prefecture.healthRate
  } else {
    totalRate = healthUnionRate || RATES.unionHealth
  }

  const employeeShare = standardRemuneration * (totalRate / 100) / 2
  return fRound(employeeShare)
}

// Calculate pension insurance (employee share)
export function calculatePension(settings) {
  const { mode, salary, customAmount, standardGrade } = settings

  if (mode === SI_MODES.CUSTOM) {
    return Math.round(customAmount || 0)
  }

  let standardRemuneration
  if (mode === SI_MODES.STANDARD && standardGrade != null) {
    const entry = PENSION_STANDARD_TABLE[standardGrade]
    standardRemuneration = entry ? entry[1] : lookupStandard(PENSION_STANDARD_TABLE, salary)
  } else {
    standardRemuneration = lookupStandard(PENSION_STANDARD_TABLE, salary)
  }

  const employeeShare = standardRemuneration * (RATES.pension / 100) / 2
  return Math.round(employeeShare)
}

// Calculate nursing care insurance (employee share)
export function calculateNursing(settings) {
  const {
    isCollected,
    customAmount,
    useCustom,
    salary,
    healthMode,
    healthStandardGrade,
    nursingUnionRate,
  } = settings

  if (!isCollected) return 0

  if (useCustom) {
    return Math.round(customAmount || 0)
  }

  let standardRemuneration
  if (healthMode === SI_MODES.STANDARD && healthStandardGrade != null) {
    const entry = HEALTH_STANDARD_TABLE[healthStandardGrade]
    standardRemuneration = entry ? entry[1] : lookupStandard(HEALTH_STANDARD_TABLE, salary)
  } else {
    standardRemuneration = lookupStandard(HEALTH_STANDARD_TABLE, salary)
  }

  const rate = nursingUnionRate || RATES.nursing
  const employeeShare = standardRemuneration * (rate / 100) / 2
  return fRound(employeeShare)
}

// Calculate employment insurance (employee share)
// Uses Math.floor per official 切り捨て rounding. No monthly cap.
export function calculateEmployment(settings) {
  const { salary, rate, totalEarnings } = settings
  const base = totalEarnings || salary
  return Math.floor(base * (rate / 100))
}

// 電算機特例: Calculate 甲欄 withholding tax using official electronic formula
// Input: afterSi = 社会保険料等控除後の給与等の金額
function calculateElectronic(afterSi, dependents) {
  if (afterSi <= 0) return 0

  // Step 1: 給与所得控除 (salary income deduction)
  let salaryDeduction = 0
  for (const bracket of MONTHLY_SALARY_DEDUCTION) {
    if (afterSi <= bracket.upper) {
      salaryDeduction = bracket.calc(afterSi)
      break
    }
  }

  // Step 2: 給与所得 = 社保控除後 - 給与所得控除
  const employmentIncome = Math.max(0, afterSi - salaryDeduction)

  // Step 3: 基礎控除 (basic deduction, phases out at very high income)
  let basicDeduction = 0
  for (const bracket of MONTHLY_BASIC_DEDUCTION) {
    if (employmentIncome <= bracket.upper) {
      basicDeduction = bracket.amount
      break
    }
  }

  // Step 4: 課税所得 = 給与所得 - 基礎控除 - 扶養控除(31,667円/人)
  const dependentDeduction = dependents * 31667
  const taxableIncome = Math.max(0, employmentIncome - basicDeduction - dependentDeduction)

  if (taxableIncome <= 0) return 0

  // Step 5: Apply progressive tax rates (rates include 復興特別所得税 2.1%)
  let tax = 0
  for (const bracket of MONTHLY_TAX_BRACKETS) {
    if (taxableIncome <= bracket.upper) {
      tax = Math.floor(taxableIncome * bracket.rate - bracket.deduction)
      break
    }
  }

  // Step 6: Round to nearest 10 yen (10円未満四捨五入)
  return Math.round(Math.max(0, tax) / 10) * 10
}

// 乙欄: Calculate withholding tax for secondary employment
// Approximation based on official 月額表 乙欄 data points.
// Applied to 社保控除後金額 directly (no salary/basic/dependent deductions).
function calculateOtsu(afterSi) {
  if (afterSi <= 0) return 0

  let tax = 0
  for (const bracket of OTSU_TAX_BRACKETS) {
    if (afterSi <= bracket.upper) {
      tax = Math.floor(afterSi * bracket.rate - bracket.deduction)
      break
    }
  }

  return Math.round(Math.max(0, tax) / 10) * 10
}

// Calculate salary income deduction (給与所得控除) - annual
function calculateSalaryDeduction(annualSalary) {
  for (const bracket of SALARY_DEDUCTION_TABLE) {
    if (annualSalary <= bracket.upper) {
      return bracket.calc(annualSalary)
    }
  }
  return 1950000
}

// Calculate monthly withholding tax (源泉徴収税)
export function calculateWithholdingTax(settings) {
  const {
    monthlySalary,
    socialInsuranceTotal,
    dependents = 0,
    isExempt = false,
    isNonResident = false,
    taxExemptAllowances = 0,
    taxColumn = 'kou',
  } = settings

  if (isExempt) return 0

  // 社会保険料等控除後の給与等の金額
  const afterSi = monthlySalary - socialInsuranceTotal - taxExemptAllowances

  // Non-resident: flat 20.42% (Math.floor per e-kyu.com)
  if (isNonResident) {
    return Math.floor(Math.max(0, afterSi) * NON_RESIDENT_TAX_RATE)
  }

  // 乙欄 (secondary employment)
  if (taxColumn === 'otsu') {
    return calculateOtsu(Math.max(0, afterSi))
  }

  // 甲欄 電算機特例 (default)
  return calculateElectronic(Math.max(0, afterSi), dependents)
}

// Calculate monthly resident tax (住民税)
export function calculateResidentTax(settings) {
  const { mode, annualSalary, customAnnualAmount, socialInsuranceMonthly } = settings

  if (mode === 'manual') {
    return Math.round((customAnnualAmount || 0) / 12)
  }

  // Auto: approximate annual income tax base, then 10%
  const annualSI = socialInsuranceMonthly * 12
  const salaryDeduction = calculateSalaryDeduction(annualSalary)
  const basicDeduction = 480000
  const taxableIncome = Math.max(0, annualSalary - salaryDeduction - annualSI - basicDeduction)
  const annualResidentTax = Math.round(taxableIncome * (RESIDENT_TAX_RATE / 100)) + 5000
  return Math.round(annualResidentTax / 12)
}

// Master calculation: calculate all deductions and take-home pay
export function calculateTakeHome(settings) {
  const {
    salary,
    month,
    prefectureIndex,
    ageGroup,
    // Health
    healthMode,
    healthIsKyokai,
    healthCustomAmount,
    healthStandardGrade,
    healthUnionRate,
    // Pension
    pensionMode,
    pensionCustomAmount,
    pensionStandardGrade,
    // Nursing
    nursingIsCollected,
    nursingUseCustom,
    nursingCustomAmount,
    nursingUnionRate,
    // Employment
    employmentRate,
    employmentJoined,
    // Tax
    dependents,
    isTaxExempt,
    isNonResident,
    taxColumn = 'kou',
    // Resident tax
    residentTaxMode,
    residentTaxCustomAnnual,
    residentTaxHidden,
    // SI collection timing (for future rate-period support)
    siCollectionTiming = 'tougetsu',
    // Allowances, bonuses, deductions
    allowances = [],
    bonusMonths = [],
    deductions = [],
  } = settings

  // Separate taxable and tax-exempt allowances
  const taxExemptAllowances = allowances
    .filter((a) => a.taxExempt)
    .reduce((sum, a) => sum + Math.min(a.amount || 0, COMMUTE_TAX_FREE_LIMIT), 0)
  const totalAllowances = allowances.reduce((sum, a) => sum + (a.amount || 0), 0)

  // SI-exempt allowances (excluded from 標準報酬月額 calculation)
  const siExemptAllowances = allowances
    .filter((a) => a.siExempt)
    .reduce((sum, a) => sum + (a.amount || 0), 0)

  // Bonus (if current month is a bonus month)
  const isBonusMonth = bonusMonths.some((b) => b.month === month && b.enabled)
  const bonusEntry = bonusMonths.find((b) => b.month === month && b.enabled)
  const bonusAmount = isBonusMonth && bonusEntry ? (bonusEntry.amount || 0) : 0

  // Gross = base salary + allowances + bonus
  const grossSalary = salary + totalAllowances + bonusAmount

  // Social insurance calculations use base salary minus SI-exempt allowances
  const siBaseSalary = salary + totalAllowances - siExemptAllowances

  // Monthly social insurance
  const healthInsurance = calculateHealthInsurance({
    mode: healthMode,
    salary: siBaseSalary,
    prefectureIndex,
    isKyokai: healthIsKyokai,
    customAmount: healthCustomAmount,
    standardGrade: healthStandardGrade,
    healthUnionRate,
  })

  const pensionInsurance = calculatePension({
    mode: pensionMode,
    salary: siBaseSalary,
    customAmount: pensionCustomAmount,
    standardGrade: pensionStandardGrade,
  })

  const nursingInsurance = calculateNursing({
    isCollected: nursingIsCollected,
    customAmount: nursingCustomAmount,
    useCustom: nursingUseCustom,
    salary: siBaseSalary,
    healthMode,
    healthStandardGrade,
    nursingUnionRate,
  })

  const employmentInsurance = employmentJoined
    ? calculateEmployment({ salary: grossSalary, rate: employmentRate, totalEarnings: grossSalary })
    : 0

  // Bonus social insurance
  let bonusHealthSI = 0
  let bonusPensionSI = 0
  let bonusNursingSI = 0
  if (bonusAmount > 0 && healthMode !== SI_MODES.CUSTOM && pensionMode !== SI_MODES.CUSTOM) {
    const healthTotalRate = healthIsKyokai
      ? (PREFECTURES[prefectureIndex] || PREFECTURES[12]).healthRate
      : (healthUnionRate || RATES.unionHealth)
    bonusHealthSI = fRound(bonusAmount * (healthTotalRate / 100) / 2)

    const cappedBonus = Math.min(bonusAmount, PENSION_BONUS_CAP)
    bonusPensionSI = Math.round(cappedBonus * (RATES.pension / 100) / 2)

    if (nursingIsCollected && !nursingUseCustom) {
      const nRate = nursingUnionRate || RATES.nursing
      bonusNursingSI = fRound(bonusAmount * (nRate / 100) / 2)
    }
  }

  const totalHealthInsurance = healthInsurance + bonusHealthSI
  const totalPensionInsurance = pensionInsurance + bonusPensionSI
  const totalNursingInsurance = nursingInsurance + bonusNursingSI
  const socialInsuranceTotal = totalHealthInsurance + totalPensionInsurance + totalNursingInsurance + employmentInsurance

  // Withholding tax
  const withholdingTax = calculateWithholdingTax({
    monthlySalary: grossSalary,
    socialInsuranceTotal,
    dependents,
    isExempt: isTaxExempt,
    isNonResident,
    taxExemptAllowances,
    taxColumn,
  })

  // Resident tax
  const annualSalary = (salary + totalAllowances) * 12
  const residentTax = residentTaxHidden
    ? 0
    : calculateResidentTax({
        mode: residentTaxMode,
        annualSalary,
        customAnnualAmount: residentTaxCustomAnnual,
        socialInsuranceMonthly: healthInsurance + pensionInsurance + nursingInsurance,
      })

  // Total deductions (other deductions from paycheck)
  const totalOtherDeductions = deductions.reduce((sum, d) => sum + (d.amount || 0), 0)

  // Total deductions
  const totalDeductions = socialInsuranceTotal + withholdingTax + residentTax + totalOtherDeductions

  // Take-home pay
  const takeHome = grossSalary - totalDeductions

  // Deduction rate
  const deductionRate = grossSalary > 0 ? (totalDeductions / grossSalary) * 100 : 0

  return {
    grossSalary,
    baseSalary: salary,
    totalAllowances,
    bonusAmount,
    healthInsurance: totalHealthInsurance,
    pensionInsurance: totalPensionInsurance,
    nursingInsurance: totalNursingInsurance,
    employmentInsurance,
    socialInsuranceTotal,
    withholdingTax,
    residentTax,
    totalOtherDeductions,
    totalDeductions,
    takeHome,
    deductionRate,
    isBonusMonth,
    taxExemptAllowances,
    siExemptAllowances,
  }
}
